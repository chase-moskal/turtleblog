
import {readFile} from "./files/fsc"
import {pageRead} from "./pages/page-read"
import {listFiles} from "./files/list-files"
import {listItemTree} from "./files/list-item-tree"
import {listDirectories} from "./files/list-directories"
import {PageData, PugTemplate} from "./pages/interfaces"
import {PageReference, TurtleReader} from "./interfaces"
import {promiseAllKeys} from "./toolbox/promise-all-keys"

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
		pugPage: getPugTemplate(`${source}/templates/page.pug`),
		pugBlogIndex: getPugTemplate(`${source}/templates/blog-index.pug`),
		pugBlogPost: getPugTemplate(`${source}/templates/blog-post.pug`),

		styles: Promise.all(
			(await listFiles(source))
				.filter(path => /^(.+)\.scss$/i.test(path))
				.filter(path => !/^_(.+)/i.test(path))
				.map(async sourcePath => ({
					sourcePath,
					data: await readFile(`${source}/${sourcePath}`)
				}))
		),

		homePage: pageRead({
			source,
			sourcePath: "home"
		}),

		articleTree: listItemTree(`${source}/articles`),

		blogIndexPage: pageRead({
			source,
			sourcePath: "blog-index"
		}),

		blogPostDirectories: listDirectories(`${source}/blog`)
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
		styles: read.styles,
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
