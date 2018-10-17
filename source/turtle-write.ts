
import {dirname} from "path"
import {mkdir} from "shelljs"

import {writeFile} from "./files/fsc"
import {TurtleWriter} from "./interfaces"

function prepareDir(dist: string, distPath: string) {
	const dir = dirname(distPath)
	const dirPath = `${dist}/${dir === "." ? "" : dir}`
	mkdir("-p", dirPath)
}

/**
 * Write website output to disk
 */
export const turtleWrite: TurtleWriter = async({websiteOutput, distDir}) => {

	const pageWriteOperations = websiteOutput.pages.map(
		async({distPath, html}) => {
			prepareDir(distDir, distPath)
			const path = `${distDir}/${distPath}`
			return writeFile(path, html)
		}
	)

	const styleWriteOperations = websiteOutput.styles.map(
		async({distPath, css}) => {
			prepareDir(distDir, distPath)
			const path = `${distDir}/${distPath}`
			return writeFile(path, css)
		}
	)

	await Promise.all([
		...pageWriteOperations,
		...styleWriteOperations
	])
}
