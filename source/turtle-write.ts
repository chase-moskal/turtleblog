
import {dirname} from "path"
import {mkdir} from "shelljs"

import {writeFile} from "./files/fsc"
import {TurtleWriter} from "./interfaces"

export const turtleWrite: TurtleWriter = async({websiteOutput, dist}) => {

	const writeOperations = websiteOutput.pages.map(
		async page => {
			const dir = dirname(page.path)
			mkdir("-p", `${dist}/${dir === "." ? "" : dir}`)
			return writeFile(`${dist}/${page.path}`, page.content)
		}
	)

	await Promise.all(writeOperations)
}
