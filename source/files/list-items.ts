
import * as fs from "fs"
import {promisify} from "util"

import {DirectoryItem} from "./interfaces"
import {arrayFlatten} from "../toolbox/array-flatten"

const lstat = promisify(fs.lstat)
const readdir = promisify(fs.readdir)

export async function listItems(
	dir: string,
	recursive: boolean = false,
	path: string = ""
): Promise<DirectoryItem[]> {

	const items: DirectoryItem[] = await Promise.all(
		(await readdir(`${dir}/${path}`, {encoding: "utf8"}))
			.map(async name => {
				const newPath = path ? `${path}/${name}` : name
				const stats = await lstat(`${dir}/${newPath}`)
				const isDirectory = stats.isDirectory()
				return {name, path: newPath, isDirectory}
			})
	)

	return (recursive)

		? [
			...items,
			...arrayFlatten<DirectoryItem>(
				await Promise.all(
					items
						.filter(item => item.isDirectory)
						.map(item => listItems(dir, true, item.path))
				)
			)
		]

		: items
}
