
import {readPages} from "./turtlebox/read-pages"
// import {PageMetadata, TurtleReader} from "./interfaces"
import {listDirectories} from "./files/list-directories"

import {readFile} from "./files/fsc"
import {pageRead} from "./turtlebox/page-read"
import {listItemTree} from "./files/list-item-tree"
import {FileSystemTree} from "./files/interfaces"
import { PageData } from "./turtlebox/interfaces";

// const getPageIdFromReference = (page: PageMetadata) => ({pageId: page.id})

interface NavigationItem {
	pageId: string
	children: NavigationItem
}

interface ArticleReference {
	pageId: string
	children: ArticleReference
}

function recursiveTreeMap<T>(
	tree: FileSystemTree[],
	mapFunc: (tree: FileSystemTree) => T
): T {
	return <T><any>tree.map(item => ({
		...<any>mapFunc(item),
		children: recursiveTreeMap(item.children, mapFunc)
	}))
}

/**
 * Read a turtle website directory and return website metadata
 */
export const turtleRead = async({source}) => {
	const pages: PageData[] = []

	const [pugPage] = await Promise.all([
		readFile(`${source}/layouts/page.pug`)
	])

	//
	// read home page
	//

	const homePage = await pageRead({
		source,
		sourcePath: "home",
		pugTemplate: pugPage
	})

	//
	// read articles
	//

	const {tree: articleTree, items: articleItems} = (await listItemTree(`${source}/articles`))

	const articlePages = await Promise.all(
		articleItems.map(async item => (
			pageRead({
				source,
				sourcePath: item.path,
				pugTemplate: pugPage
			})
		))
	)

	const articleNavigation = recursiveTreeMap<ArticleReference>(articleTree, item => {
		return {
			pageId: item.id,
			children: []
		}
	})

	const articles = recursiveTreeMap<Promise<ArticleReference>[]>(articleItems, item => {
		// const page = await pageRead({source, sourcePath: item.path, pugTemplate: pugPage})
		return {
			pageId: item.id,
			children: []
		}
	})

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
