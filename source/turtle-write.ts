
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
export const turtleWrite: TurtleWriter = async({websiteOutput, dist}) => {

	const pageWriteOperations = websiteOutput.pages.map(
		async({distPath, content}) => {
			prepareDir(dist, distPath)
			const path = `${dist}/${distPath}`
			return writeFile(path, content)
		}
	)

	const styleWriteOperations = websiteOutput.styles.map(
		async({distPath, data}) => {
			prepareDir(dist, distPath)
			const path = `${dist}/${distPath}`
			return writeFile(path, data)
		}
	)

	await Promise.all([
		...pageWriteOperations,
		...styleWriteOperations
	])
}
