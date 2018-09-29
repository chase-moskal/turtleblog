
import * as shortid from "shortid"
import * as MarkdownIt from "markdown-it"

import {readFile} from "./files/fsc"
import {regex} from "./toolbox/regex"
import {listFiles} from "./files/list-files"
import {listDirectories} from "./files/list-directories"

import {
	PageMetadata,
	TurtleReader,
	PageSectionMetadata
} from "./interfaces"

const generateId = () => shortid.generate()
const markdownIt = new MarkdownIt({html: true})
const nameToTitle = (name: string) => name.replace(/-/g, " ")

export const turtleRead: TurtleReader = async({source}) => {
	const pageDirectories = await listDirectories(`${source}/pages`)
	const articlePageMetadata: PageMetadata[] = await Promise.all(
		pageDirectories.map(
			name => readPageMetadata({name, path: `${source}/pages/${name}`})
		)
	)
	const blogPostPageMetadata: PageMetadata[] = []
	const blogIndexMetadata: PageMetadata = {
		id: generateId(),
		name: "blog",
		title: "blog",
		link: "/blog",
		sections: []
	}

	const pageToReference = (page: PageMetadata) => ({pageId: page.id})

	return {
		source,
		pages: [
			...articlePageMetadata,
			...blogPostPageMetadata,
			blogIndexMetadata
		],
		articles: articlePageMetadata.map(pageToReference),
		blogPosts: [],
		blogIndex: pageToReference(blogIndexMetadata),
		navigation: []
	}
}

async function readPageMetadata({path, name}: {
	path: string
	name: string
}): Promise<PageMetadata> {

	const pageFiles = await listFiles(path)
	const markdownFiles = pageFiles.filter(filename => /.+\.md$/i.test(filename))

	const sections: PageSectionMetadata[] = await Promise.all(
		markdownFiles.map(async (filename): Promise<PageSectionMetadata> => {
			const name = regex(/^(?:|(\d+)-)(.+)\.md$/i, filename, 2)
			const title = nameToTitle(name)
			const markdown = await readFile(`${path}/${filename}`)
			const content = markdownIt.render(markdown)
			return {name, title, content}
		})
	)

	return {
		id: generateId(),
		name: name,
		title: nameToTitle(name),
		link: `/${name}`,
		sections
	}
}
