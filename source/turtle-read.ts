
import {readPages} from "./turtlebox/read-pages"
// import {PageMetadata, TurtleReader} from "./interfaces"
import {listDirectories} from "./files/list-directories"

import {readFile} from "./files/fsc"
import {pageRead} from "./turtlebox/page-read"

// const getPageIdFromReference = (page: PageMetadata) => ({pageId: page.id})

/**
 * Read a turtle website directory and return website metadata
 */
export const turtleRead = async({source}) => {

	const [pugPage] = await Promise.all([
		readFile(`${source}/layouts/page.pug`)
	])

	const homeData = await pageRead({
		source,
		sourcePath: "home",
		
		pugTemplate: pugPage
	})

	// //
	// // read home page
	// //

	// const [homeMetadata] = await readPages(source, [`home`])

	// //
	// // read articles
	// //

	// const articleDirectories = (await listDirectories(`${source}/articles`, true))
	// 	.map(pageDirectoryPath => `articles/${pageDirectoryPath}`)

	// const articlePagesMetadata = await readPages(source, articleDirectories)

	// //
	// // read blog posts
	// //

	// const blogPostPagesMetadata: PageMetadata[] = []

	// //
	// // read blog index
	// //

	// const [blogIndexMetadata] = await readPages(source, [`blog-index`])

	// //
	// // prepare and return website metadata
	// //

	// return {
	// 	source,
	// 	pages: [
	// 		homeMetadata,
	// 		...articlePagesMetadata,
	// 		...blogPostPagesMetadata,
	// 		blogIndexMetadata
	// 	],
	// 	homeReference: {pageId: homeMetadata.id},
	// 	articleReferences: articlePagesMetadata.map(getPageIdFromReference),
	// 	blogPostReferences: [],
	// 	blogIndexReference: getPageIdFromReference(blogIndexMetadata),
	// 	navigationLinkReferences: []
	// }
}
