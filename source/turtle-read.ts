
import {readFile} from "./files/fsc"
import {pageRead} from "./pages/page-read"
import {PageReference} from "./interfaces"
import {PageData} from "./pages/interfaces"
import {listItemTree} from "./files/list-item-tree"
import {listDirectories} from "./files/list-directories"

const getPug = async(path: string) => ({
	path,
	pugContent: await readFile(path)
})

const pageToReference = (page: PageData): PageReference => ({
	pageId: page.id
})

/**
 * Read a turtle website directory and return website metadata
 */
export const turtleRead = async({source}) => {
	const [pugPage, pugBlogIndex, pugBlogPost] = await Promise.all([
		getPug(`${source}/layouts/page.pug`),
		getPug(`${source}/layouts/blog-index.pug`),
		getPug(`${source}/layouts/blog-post.pug`)
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

	const articleTree = await listItemTree(`${source}/articles`)
	const articlePageTree = await articleTree
		.filter(fsItem => !!fsItem.isDirectory)
		.map(async fsItem => pageRead({
			source,
			sourcePath: `articles/${fsItem.path}`,
			pugTemplate: pugPage
		}))
		.promiseAll()
	const articlePages = articlePageTree.toArray().filter(page => !!page)

	//
	// read blog index
	//

	const blogIndexPage = await pageRead({
		source,
		sourcePath: "blog-index",
		pugTemplate: pugBlogIndex
	})

	//
	// read blog posts
	//

	const blogPostPages = await Promise.all((await listDirectories(`${source}/blog`))
		.map(async pageName => pageRead({
			source,
			sourcePath: `blog/${pageName}`,
			pugTemplate: pugBlogPost
		}))
	)

	//
	// Return website metadata
	//

	return {
		pages: [
			homePage,
			blogIndexPage,
			...articlePages,
			...blogPostPages
		],
		references: {
			home: pageToReference(homePage),
			blogIndex: pageToReference(blogIndexPage),
			blogPosts: blogPostPages.map(pageToReference),
			articles: articlePages.map(pageToReference),
			articleTree: articlePageTree.map(pageToReference)
		}
	}
}
