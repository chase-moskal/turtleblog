
import * as shortid from "shortid"
import {readFile} from "../files/fsc"
import {listFiles} from "../files/list-files"
import {PageData, PugTemplate} from "./interfaces"

const generateId = () => shortid.generate()

/**
 * Read a source page directory and return page metadata
 */
export async function pageRead({
	source,
	sourcePath
}: {
	source: string
	sourcePath: string
}): Promise<PageData | null> {

	const fullSourcePath = `${source}/${sourcePath}`
	const pageFiles = await listFiles(fullSourcePath)
	
	let pugFile = null
	const markdownFiles = []
	const otherFiles = []
	for (const filename of pageFiles) {
		if (/.+\.md$/i.test(filename))
			markdownFiles.push(filename)
		else if (/.+\.pug$/i.test(filename))
			pugFile = filename
		else {
			otherFiles.push(filename)
		}
	}

	const pugPath = `${fullSourcePath}/${pugFile}`
	const finalPugTemplate: PugTemplate = pugFile
		? {
			path: pugPath,
			pugContent: await readFile(pugPath)
		}
		: null

	if (markdownFiles.length || otherFiles.length)
		return {
			id: generateId(),
			sourcePath,
			markdowns: await Promise.all(markdownFiles.map(async(filename) => ({
				filename,
				markdown: await readFile(`${fullSourcePath}/${filename}`)
			}))),
			pugTemplate: finalPugTemplate,
			files: otherFiles
		}
}
