
import * as fs from "fs"
import {promisify} from "util"
import {FileSystemTree, FileSystemItem} from "./interfaces"

const lstat = promisify(fs.lstat)
const readdir = promisify(fs.readdir)

export async function listItemTree(
	dir: string,
	pathProgress: string = ""
): Promise<{tree: FileSystemTree[], items: FileSystemItem[]}> {
	let items: FileSystemItem[] = []

	const tree = await Promise.all(
		(await readdir(`${dir}/${pathProgress}`, {encoding: "utf8"}))
			.map(async name => {
				const path = pathProgress
					? `${pathProgress}/${name}`
					: name
				const stats = await lstat(`${dir}/${path}`)
				const isDirectory = stats.isDirectory()

				let children: FileSystemTree[] = []
				if (isDirectory) {
					const {tree, items: newItems} = await listItemTree(dir, path)
					children = [...children, ...tree]
					items = [...items, ...newItems]
				}

				return {name, path, isDirectory, children}
			})
	)

	return {tree, items}
}
