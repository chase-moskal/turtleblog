
import {listItems} from "./list-items"
import {listItemTree} from "./list-item-tree"

export async function listDirectories(dir: string, recursive: boolean = false): Promise<string[]> {

	const items = (recursive)
		? (await listItemTree(dir)).items
		: (await listItems(dir))

	return items
		.filter(item => !!item.isDirectory)
		.map(({path}) => path)
}
