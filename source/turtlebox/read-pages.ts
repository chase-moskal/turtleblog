
import * as path from "path"
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
 * Read page metadata for an array of directories
 * - filter out any null results
 */
export async function readPages(
	source: string,
	sourcePaths: string[]
): Promise<PageMetadata[]> {

	const readings: PageMetadata[] = await Promise.all(sourcePaths.map(
		path => readPageDirectory(source, path)
	))

	return readings.filter(page => !!page)
}

/**
 * Read a source page directory and return page metadata
 */
async function readPageDirectory(
	source: string,
	sourcePath: string
): Promise<PageMetadata | null> {
	const name = path.basename(sourcePath)
	const fullSourcePath = `${source}/${sourcePath}`

	const pageFiles = await listFiles(fullSourcePath)
	const markdownFiles = pageFiles.filter(filename => /.+\.md$/i.test(filename))

	if (!markdownFiles.length)
		return null

	const sections: PageSectionMetadata[] = await Promise.all(
		markdownFiles.map(async (filename): Promise<PageSectionMetadata> => {
			const name = regex(/^(?:|(\d+)-)(.+)\.md$/i, filename, 2)
			const title = nameToTitle(name)
			const markdown = await readFile(`${fullSourcePath}/${filename}`)
			const content = renderMarkdown(markdown)
			return {name, title, content}
		})
	)

	return {
		id: generateId(),
		sourcePath,
		name,
		title: nameToTitle(name),
		link: `/${sourcePath}`,
		sections
	}
}
