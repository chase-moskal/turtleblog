
import * as path from "path"
import * as shell from "shelljs"

import * as fsc from "./files/fsc"
import {TurtleWriter} from "./interfaces"

function prepareDir(dist: string, distPath: string) {
	const dir = path.dirname(distPath)
	const dirPath = `${dist}/${dir === "." ? "" : dir}`
	shell.mkdir("-p", dirPath)
}

/**
 * Write website output to disk
 */
export const turtleWrite: TurtleWriter = async({websiteOutput, distDir}) => {

	const pageWriteOperations = websiteOutput.pages.map(
		async({distPath, html, files}) => {
			prepareDir(distDir, distPath)
			const path = `${distDir}/${distPath}`
			const writePageOperation = fsc.writeFile(path, html)
			const copyFilesOperations = files.map(({sourcePathFull, distDirPath}) =>
				shell.cp(sourcePathFull, `${distDir}/${distDirPath}`))
			await Promise.all([writePageOperation, ...copyFilesOperations])
		}
	)

	const styleWriteOperations = websiteOutput.styles.map(
		async({distPath, css}) => {
			prepareDir(distDir, distPath)
			const path = `${distDir}/${distPath}`
			await fsc.writeFile(path, css)
		}
	)

	await Promise.all([
		...pageWriteOperations,
		...styleWriteOperations
	])
}
