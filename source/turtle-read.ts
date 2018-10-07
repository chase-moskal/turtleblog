
import {readFile} from "./files/fsc"
import {pageRead} from "./pages/page-read"
import {listItemTree} from "./files/list-item-tree"
import {listDirectories} from "./files/list-directories"
import {PageData, PugTemplate} from "./pages/interfaces"
import {promiseAllKeys} from "./toolbox/promise-all-keys"
import {PageReference, TurtleReader, WebsiteTemplates} from "./interfaces"

const getPugTemplate = async(path: string): Promise<PugTemplate> => ({
	path,
	pugContent: await readFile(path)
})

const pageToReference = (page: PageData): PageReference => ({
	pageId: page.id
})

/**
 * Read a turtle website directory and return website metadata
 */
export const turtleRead: TurtleReader = async({source}) => {

	//
	// read all resources simultaneously
	//

	const read = await promiseAllKeys({
		pugPage: getPugTemplate(`${source}/layouts/page.pug`),
		pugBlogIndex: getPugTemplate(`${source}/layouts/blog-index.pug`),
		pugBlogPost: getPugTemplate(`${source}/layouts/blog-post.pug`),

		homePage: pageRead({
			source,
			sourcePath: "home"
		}),

		articleTree: listItemTree(`${source}/articles`),

		blogIndexPage: pageRead({
			source,
			sourcePath: "blog-index"
		}),

		blogPostDirectories: listDirectories(`${source}/blog`),
	})

	//
	// read article pages
	//

	const articlePageTree = await read.articleTree
		.filter(fsItem => !!fsItem.isDirectory)
		.map(async fsItem => pageRead({
			source,
			sourcePath: `articles/${fsItem.path}`
		}))
		.promiseAll()
	const articlePages = articlePageTree.toArray().filter(page => !!page)

	//
	// read blog posts
	//

	const blogPostPages = await Promise.all(
		read.blogPostDirectories.map(async pageName => pageRead({
			source,
			sourcePath: `blog/${pageName}`
		}))
	)

	//
	// return website metadata
	//

	return {
		source,
		templates: {
			home: read.pugPage,
			article: read.pugPage,
			blogIndex: read.pugBlogIndex,
			blogPost: read.pugBlogPost
		},
		pages: [
			read.homePage,
			read.blogIndexPage,
			...articlePages,
			...blogPostPages
		],
		references: {
			home: pageToReference(read.homePage),
			blogIndex: pageToReference(read.blogIndexPage),
			blogPosts: blogPostPages.map(pageToReference),
			articles: articlePages.map(pageToReference),
			articleTree: articlePageTree.map(pageToReference)
		}
	}
}
