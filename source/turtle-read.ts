
import {listDirectories} from "./files/list-directories"
import {readPageMetadata} from "./turtlebox/read-page-metadata"

import {
	PageMetadata,
	TurtleReader
} from "./interfaces"

const getPageIdFromReference = (page: PageMetadata) => ({pageId: page.id})

export const turtleRead: TurtleReader = async({source, blog, home}) => {

	//
	// read articles
	//

	const pageDirectories = await listDirectories(`${source}/pages`)
	const articlePagesMetadata: PageMetadata[] = await Promise.all(
		pageDirectories.map(
			name => readPageMetadata({name, dirPath: `${source}/pages/${name}`})
		)
	)

	//
	// read blog posts
	//

	const blogPostPagesMetadata: PageMetadata[] = []

	//
	// read blog index
	//

	const blogIndexMetadata = await readPageMetadata({
		name: blog,
		dirPath: `${source}/${blog}`
	})

	//
	// return website metadata
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
