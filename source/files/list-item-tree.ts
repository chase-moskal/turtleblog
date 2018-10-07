
import * as fs from "fs"
import {promisify} from "util"

import {FileSystemItem} from "./interfaces"
import {TreeNode} from "../toolbox/tree-node"

const lstat = promisify(fs.lstat)
const readdir = promisify(fs.readdir)

export async function listItemTree(
	dir: string,
	pathProgress: string = ""
): Promise<TreeNode<FileSystemItem>> {

	// obtain the tree recursively, and also push to the flat items array
	const treeNodes = await Promise.all(

		// read each item in the given directory
		(await readdir(`${dir}/${pathProgress}`, {encoding: "utf8"}))

			// convert each item into a tree node
			.map(async name => {

				// update the path progression as we recurse deeper
				const path = pathProgress
					? `${pathProgress}/${name}`
					: name

				// obtain the stats for the file system item
				const stats = await lstat(`${dir}/${path}`)
				const isDirectory = stats.isDirectory()
				const item: FileSystemItem = {path, isDirectory}

				// create the tree node
				const treeNode = new TreeNode<FileSystemItem>(item)

				// if the item is a directory, perform recursion to read children
				if (isDirectory) {

					// recursively list the child directory
					const tree = await listItemTree(dir, path)

					// add child tree nodes as children to the parent tree
					for (const childTreeNode of tree.children)
						treeNode.addChildNode(childTreeNode)
				}

				return treeNode
			})
	)

	const tree = new TreeNode<FileSystemItem>(undefined, true)
	for (const node of treeNodes) tree.addChildNode(node)

	return tree
}
