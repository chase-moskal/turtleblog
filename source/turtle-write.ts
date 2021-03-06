
import {dirname} from "path"
import {mkdir} from "shelljs"

import {writeFile} from "./files/fsc"
import {TurtleWriter} from "./interfaces"

/**
 * Write website output to disk
 */
export const turtleWrite: TurtleWriter = async({websiteOutput, dist}) => {

	const writeOperations = websiteOutput.pages.map(
		async page => {
			const dir = dirname(page.distPath)
			mkdir("-p", `${dist}/${dir === "." ? "" : dir}`)
			return writeFile(`${dist}/${page.distPath}`, page.content)
		}
	)

	await Promise.all(writeOperations)
}
