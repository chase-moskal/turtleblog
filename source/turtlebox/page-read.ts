
import * as shortid from "shortid"
import {PageData} from "./interfaces"
import {listFiles} from "../files/list-files"
import { readFile } from "../files/fsc";

const generateId = () => shortid.generate()

/**
 * Read a source page directory and return page metadata
 */
export async function pageRead({
	source,
	sourcePath,
	pugTemplate
}: {
	source: string
	sourcePath: string
	pugTemplate?: string
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

	if (markdownFiles.length || otherFiles.length)
		return {
			id: generateId(),
			sourcePath,
			markdowns: await Promise.all(markdownFiles.map(async(filename) => ({
				filename,
				markdown: await readFile(`${fullSourcePath}/${filename}`)
			}))),
			pugTemplate: pugFile
				? await readFile(`${fullSourcePath}/${pugFile}`)
				: pugTemplate,
			files: otherFiles
		}
}
