
import * as fs from "fs"
import {promisify} from "util"

import {FileSystemItem} from "./interfaces"

const lstat = promisify(fs.lstat)
const readdir = promisify(fs.readdir)

export async function listItems(
	dir: string
): Promise<FileSystemItem[]> {

	return await Promise.all(
		(await readdir(`${dir}`, {encoding: "utf8"}))
			.map(async path => {
				const stats = await lstat(`${dir}/${path}`)
				const isDirectory = stats.isDirectory()
				return {path, isDirectory}
			})
	)
}
