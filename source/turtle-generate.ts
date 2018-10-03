
import * as pug from "pug"

import {readFile} from "./files/fsc"
import {regex} from "./toolbox/regex"
import {TurtleGenerator, PageOutput} from "./interfaces"

/**
 * Generate website output from the provided website metadata
 */
export const turtleGenerate: TurtleGenerator = async({websiteMetadata}) => {
	const {source} = websiteMetadata

	//
	// grab standard pug layouts
	//

	const compilePugRenderer = async(path: string) =>
		pug.compile(await readFile(path), {filename: path})

	const [
		renderPage,
		renderBlogPost,
		renderBlogIndex
	] = await Promise.all([
		compilePugRenderer(`${source}/layouts/page.pug`),
		compilePugRenderer(`${source}/layouts/blog-post.pug`),
		compilePugRenderer(`${source}/layouts/blog-index.pug`),
	])

	//
	// generate article pages
	//

	const articlePages: PageOutput[] = websiteMetadata.articles.map(
		articleMetadata => {
			const pageMetadata = websiteMetadata.pages.find(
				page => page.id === articleMetadata.pageId
			)
			const isHome = pageMetadata.id === websiteMetadata.homeId
			const choppedPath = regex(/pages\/(.+)/i, pageMetadata.sourcePath)
			return {
				id: pageMetadata.id,
				name: pageMetadata.name,
				distPath: isHome
					? `index.html`
					: `${choppedPath}/index.html`,
				content: renderPage({
					pageMetadata,
					websiteMetadata,
					articleMetadata
				}),
				files: []
			}
		}
	)

	//
	// generate blog posts
	//

	const blogPosts: PageOutput[] = websiteMetadata.blogPosts.map(
		blogPostMetadata => {
			const pageMetadata = websiteMetadata.pages.find(
				page => page.id === blogPostMetadata.pageId
			)
			return {
				id: pageMetadata.id,
				name: pageMetadata.name,
				distPath: `${websiteMetadata.blog}/${blogPostMetadata.date}`
					+ `/${pageMetadata.name}/index.html`,
				content: renderBlogPost({
					pageMetadata,
					websiteMetadata,
					blogPostMetadata
				}),
				files: []
			}
		}
	)

	//
	// generate blog index
	//

	const blogIndexPage = websiteMetadata.pages.find(
		page => page.id === websiteMetadata.blogIndex.pageId
	)

	const blogIndex: PageOutput = {
		id: blogIndexPage.id,
		name: blogIndexPage.name,
		distPath: `blog/index.html`,
		content: renderBlogIndex({
			pageMetadata: blogIndexPage,
			websiteMetadata,
			blogIndexMetadata: websiteMetadata.blogIndex
		}),
		files: []
	}

	//
	// return website output
	//

	return {
		pages: [
			...articlePages,
			...blogPosts,
			blogIndex
		]
	}
}
