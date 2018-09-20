
import {listFiles} from "../files/list-files"
import {Page} from "./interfaces"

type PageTransformer = (page: string) => string

export async function loadPages({source, pageLabeler, pageLinker}: {
	source: string
	pageLabeler: PageTransformer
	pageLinker: PageTransformer
}): Promise<Page[]> {

	// list files in pages dir
	return (await listFiles(`${source}/pages`))

		// filter for markdown files
		.filter(file => /\.md$/i.test(file))

		// chop off the .md extensions
		.map(file => /^(.+)\.md$/i.exec(file)[1])

		// add the label and link properties
		.map(name => ({
			name,
			label: pageLabeler(name),
			link: pageLinker(name)
		}))
}
