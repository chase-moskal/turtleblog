
import {listFiles} from "../files/list-files"

export async function loadPages({source}: {source: string}): Promise<string[]> {

	// list files in pages dir
	return (await listFiles(`${source}/pages`))

		// filter for markdown files
		.filter(file => /\.md$/i.test(file))

		// chop off the .md extensions
		.map(file => /^(.+)\.md$/i.exec(file)[1])
}
