
import * as fs from "fs"
import {promisify} from "util"
import {DirectoryItem} from "./interfaces"

const lstat = promisify(fs.lstat)
const readdir = promisify(fs.readdir)

export async function listItems(dir: string): Promise<DirectoryItem[]> {
	return Promise.all(
		(await readdir(dir, {encoding: "utf8"}))
			.map(async name => {
				const stats = await lstat(`${dir}/${name}`)
				const isDirectory = stats.isDirectory()
				return {name, isDirectory}
			})
	)
}
