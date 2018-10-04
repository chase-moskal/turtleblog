
import {readFile} from "./files/fsc"
import {pageRead} from "./pages/page-read"
import {PageData} from "./pages/interfaces"
import {listItemTree} from "./files/list-item-tree"

// const getPageIdFromReference = (page: PageMetadata) => ({pageId: page.id})

interface NavigationItem {
	pageId: string
	children: NavigationItem
}

interface ArticleReference {
	pageId: string
	children: ArticleReference
}

/**
 * Read a turtle website directory and return website metadata
 */
export const turtleRead = async({source}) => {
	const pages: PageData[] = []

	const [pugPage, blogIndex, blogPost] = await Promise.all([
		readFile(`${source}/layouts/page.pug`),
		readFile(`${source}/layouts/blog-index.pug`),
		readFile(`${source}/layouts/blog-post.pug`)
	])

	//
	// read home page
	//

	const homePage = await pageRead({
		source,
		sourcePath: "home",
		pugTemplate: pugPage
	})

	const articles = await listItemTree(`${source}/articles`)
	const articlePageDirectories = articles.items.filter(item => item.isDirectory)
	const articlePages = (await Promise.all(
		articlePageDirectories
			.map(async item => pageRead({
				source,
				sourcePath: `articles/${item.path}`,
				pugTemplate: pugPage
			}))
	)).filter(page => !!page)

	return {
		source,
		pages: [
			homePage,
			articles.items
		]
		// homeReference: HomeReference
		// articleReferences: ArticleReference[]
		// blogIndexReference: BlogIndexReference
		// blogPostReferences: BlogPostReference[]
		// navigationLinkReferences: NavigationLinkReference[]
	}

	//
	// read articles
	//

	// const {tree: articleTree, items: articleItems} = (await listItemTree(`${source}/articles`))

	// const articlePages = await Promise.all(
	// 	articleItems.map(async item => (
	// 		pageRead({
	// 			source,
	// 			sourcePath: item.path,
	// 			pugTemplate: pugPage
	// 		})
	// 	))
	// )

	// const articleNavigation = recursiveTreeMap<ArticleReference>(articleTree, item => {
	// 	return {
	// 		pageId: item.id,
	// 		children: []
	// 	}
	// })

	// const articles = recursiveTreeMap<Promise<ArticleReference>[]>(articleItems, item => {
	// 	// const page = await pageRead({source, sourcePath: item.path, pugTemplate: pugPage})
	// 	return {
	// 		pageId: item.id,
	// 		children: []
	// 	}
	// })

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
