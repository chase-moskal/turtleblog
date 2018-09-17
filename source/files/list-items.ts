
import * as fs from "fs"
import {DirectoryItem} from "./interfaces"
const {readdir, lstat} = fs.promises

export async function listItems(dir: string): Promise<DirectoryItem[]> {
	const dirContents = await readdir(dir, {encoding: "utf8"})
	const dirItemPromises = dirContents.map(async name => {
		const stats = await lstat(name)
		const isDirectory = stats.isDirectory()
		return {name, isDirectory}
	})
	return Promise.all(dirItemPromises)
}
