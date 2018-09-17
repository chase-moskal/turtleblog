
import {listItems} from "./list-items"

export async function listDirectories(dir: string): Promise<string[]> {
	return (await listItems(dir))
		.filter(item => !!item.isDirectory)
		.map(({name}) => name)
}
