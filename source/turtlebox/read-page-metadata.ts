
import * as shortid from "shortid"
import * as MarkdownIt from "markdown-it"

import {readFile} from "../files/fsc"
import {regex} from "../toolbox/regex"
import {listFiles} from "../files/list-files"
import {PageMetadata, PageSectionMetadata} from "../interfaces"

const generateId = () => shortid.generate()
const markdownIt = new MarkdownIt({html: true})
const nameToTitle = (name: string) => name.replace(/-/g, " ")
const renderMarkdown = (markdown: string) => markdownIt.render(markdown)

/**
 * Read a source page directory and return page metadata
 */
export async function readPageMetadata({name, dirPath}: {

		/** Url-safe name of the page */
		name: string

		/** Source path to the page directory */
		dirPath: string

}): Promise<PageMetadata> {

	const pageFiles = await listFiles(dirPath)
	const markdownFiles = pageFiles.filter(filename => /.+\.md$/i.test(filename))

	const sections: PageSectionMetadata[] = await Promise.all(
		markdownFiles.map(async (filename): Promise<PageSectionMetadata> => {
			const name = regex(/^(?:|(\d+)-)(.+)\.md$/i, filename, 2)
			const title = nameToTitle(name)
			const markdown = await readFile(`${dirPath}/${filename}`)
			const content = renderMarkdown(markdown)
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
