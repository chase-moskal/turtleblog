
import * as path from "path"
import * as jsYaml from "js-yaml"
import * as shortid from "shortid"

import {readFile} from "../files/fsc"
import {listFiles} from "../files/list-files"
import {PageData, PageDetails, PugTemplate} from "./interfaces"

const generateId = () => shortid.generate()

/**
 * Read a source page directory and return page data
 * - returns null if the given directory isn't a valid page
 */
export async function pageRead({
	sourceDir,
	sourcePath
}: {
	sourceDir: string
	sourcePath: string
}): Promise<PageData | null> {

	// read all files in page directory
	const sourcePathFull = `${sourceDir}/${sourcePath}`
	const pageFiles = await listFiles(sourcePathFull)

	// pluck out key files
	let detailsFile: string = null
	let pugFile: string = null
	const markdownFiles = []
	const otherFiles = []
	for (const filename of pageFiles) {
		if (/.+\.md$/i.test(filename))
			markdownFiles.push(filename)
		else if (/.+\.pug$/i.test(filename))
			pugFile = filename
		else if (/^(?:page-|)details\.yml$/i.test(filename))
			detailsFile = filename
		else {
			otherFiles.push(filename)
		}
	}

	// reject invalid pages
	if (!detailsFile && !markdownFiles.length && !pugFile)
		return null

	// read details yml
	const detailsPath = `${sourcePathFull}/${detailsFile}`
	const defaultName = path.basename(sourcePathFull)
	let detailsReading: PageDetails
	if (detailsFile) {
		try {
			const detailsText = await readFile(detailsPath)
			detailsReading = jsYaml.safeLoad(detailsText)
		}
		catch (error) {
			error.message = `error parsing details.yml "${detailsPath}": ${error.message}`
			throw error
		}
	}

	// setting some default details
	const details = {
		name: defaultName,
		title: defaultName.replace(/-/ig, " "),
		...detailsReading
	}

	// read pug template
	const pugPath = `${sourcePathFull}/${pugFile}`
	const pugTemplate: PugTemplate = pugFile
		? {
			path: pugPath,
			pugContent: await readFile(pugPath)
		}
		: null

	// read markdown data
	const markdowns = await Promise.all(
		markdownFiles.map(async(filename) => ({
			filename,
			markdown: await readFile(`${sourcePathFull}/${filename}`)
		}))
	)

	// return page data
	return {
		id: generateId(),
		details,
		sourcePath,

		// read markdown files
		markdowns,

		pugTemplate,
		otherFileNames: otherFiles
	}
}
