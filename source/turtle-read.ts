
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
 * Read a turtle website directory and return website data
 */
export const turtleRead: TurtleReader = async({siteTitle, sourceDir}) => {

	//
	// read resources simultaneously for better performance
	//

	const read = await promiseAllKeys({
		templates: promiseAllKeys({
			home: getPugTemplate(`${sourceDir}/templates/home.pug`),
			article: getPugTemplate(`${sourceDir}/templates/article.pug`),
			blogIndex: getPugTemplate(`${sourceDir}/templates/blog-index.pug`),
			blogPost: getPugTemplate(`${sourceDir}/templates/blog-post.pug`),
		}),

		styles: Promise.all(
			(await listFiles(sourceDir))
				.filter(path => /^(.+)\.scss$/i.test(path))
				.filter(path => !/^_(.+)/i.test(path))
				.map(async sourcePath => ({
					sourcePath,
					scss: await readFile(`${sourceDir}/${sourcePath}`)
				}))
		),

		homePage: pageRead({
			sourceDir,
			siteTitle,
			sourcePath: "home"
		}),

		articleItemTree: listItemTree(`${sourceDir}/articles`),

		blogIndexPage: pageRead({
			sourceDir,
			siteTitle,
			sourcePath: "blog-index"
		}),

		blogPostDirectories: listDirectories(`${sourceDir}/blog-posts`)
	})

	//
	// read article pages
	//

	const articlePageTree = await (
		read.articleItemTree
			.filter(fsItem => !!fsItem.isDirectory)
			.map(async fsItem => pageRead({
				sourceDir,
				siteTitle,
				sourcePath: `articles/${fsItem.path}`
			}))
			.promiseAll()
	)

	const articlePages = articlePageTree.toArray().filter(page => !!page)

	//
	// read blog posts
	//

	const blogPostPages = await Promise.all(
		read.blogPostDirectories.map(async pageName => pageRead({
			sourceDir,
			siteTitle,
			sourcePath: `blog-posts/${pageName}`
		}))
	)

	//
	// return website data
	//

	return {
		sourceDir,
		styles: read.styles,
		templates: read.templates,
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
