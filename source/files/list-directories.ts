
import {listItems} from "./list-items"

export async function listDirectories(dir: string, recursive: boolean = false): Promise<string[]> {
	return (await listItems(dir, recursive))
		.filter(item => !!item.isDirectory)
		.map(({path}) => path)
}
