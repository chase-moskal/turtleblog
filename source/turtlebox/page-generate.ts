
import * as pug from "pug"
import * as path from "path"
import * as shortid from "shortid"
import * as MarkdownIt from "markdown-it"

import {readFile} from "../files/fsc"
import {regex} from "../toolbox/regex"
import {listFiles} from "../files/list-files"
import {PageData, PageContext, PageOutput, SectionData} from "./interfaces"

const generateId = () => shortid.generate()
const markdownIt = new MarkdownIt({html: true})
const nameToTitle = (name: string) => name.replace(/-/g, " ")
const renderMarkdown = (markdown: string) => markdownIt.render(markdown)

export type PageContextualizer = (pageData: PageData) => PageContext

// const defaultPageContextualizer: PageContextualizer = (pageData: PageData): PageContext => ({
// 	id: pageData.id,
// 	name: "",
// 	link: "",
// 	title: "",
// 	sections: []
// })

export async function pageGenerate({pageData}: {
	pageData: PageData
}): Promise<PageOutput> {

	const sections: SectionData[] = await Promise.all(
		pageData.markdowns.map(async({filename, markdown}) => {
			const name = regex(/^(?:|(\d+)-)(.+)\.md$/i, filename, 2)
			const title = nameToTitle(name)
			const html = renderMarkdown(markdown)
			return {name, title, html}
		})
	)

	const renderPug = pug.compile(pageData.pugTemplate)
	const name = path.basename(pageData.sourcePath)

	const pageContext: PageContext = {
		id: pageData.id,
		name,
		title: nameToTitle(name),
		link: pageData.source
	}

	// const sections: PageSectionMetadata[] = await Promise.all(
	// 	markdownFiles.map(async(filename): Promise<PageSectionMetadata> => {
	// 		const name = regex(/^(?:|(\d+)-)(.+)\.md$/i, filename, 2)
	// 		const title = nameToTitle(name)
	// 		const markdown = await readFile(`${fullSourcePath}/${filename}`)
	// 		const content = renderMarkdown(markdown)
	// 		return {name, title, content}
	// 	})
	// )

	// return {
	// 	id: generateId(),
	// 	sourcePath,
	// 	title: nameToTitle(name),
	// 	link: `/${sourcePath}`,
	// }

	return {
		id: pageData.id,
		html: ,
		sections
	}
}
