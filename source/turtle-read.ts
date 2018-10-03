
import {readPages} from "./turtlebox/read-pages"
import {PageMetadata, TurtleReader} from "./interfaces"
import {listDirectories} from "./files/list-directories"

const getPageIdFromReference = (page: PageMetadata) => ({pageId: page.id})

/**
 * Read a turtle website directory and return website metadata
 */
export const turtleRead: TurtleReader = async({source, blog, home}) => {

	//
	// read articles
	//

	const pageDirectories = (await listDirectories(`${source}/pages`, true))
		.map(pageDirectoryPath => `pages/${pageDirectoryPath}`)

	const articlePagesMetadata = await readPages(source, pageDirectories)

	//
	// read blog posts
	//

	const blogPostPagesMetadata: PageMetadata[] = []

	//
	// read blog index
	//

	const [blogIndexMetadata] = await readPages(source, [blog])

	//
	// prepare and return website metadata
	//

	return {
		source,
		blog,
		homeId: articlePagesMetadata.find(p => p.name === home).id,
		pages: [
			...articlePagesMetadata,
			...blogPostPagesMetadata,
			blogIndexMetadata
		],
		articles: articlePagesMetadata.map(getPageIdFromReference),
		blogPosts: [],
		blogIndex: getPageIdFromReference(blogIndexMetadata),
		navigation: []
	}
}
