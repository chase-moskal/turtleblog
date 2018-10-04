
import * as pug from "pug"

import {readFile} from "./files/fsc"
import {regex} from "./toolbox/regex"
import {TurtleGenerator, PageOutput} from "./interfaces"

/**
 * Generate website output from the provided website metadata
 */
export const turtleGenerate: TurtleGenerator = async({websiteMetadata, blog, home}) => {
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
	// generate home page
	//

	const homeMetadata = websiteMetadata.pages.find(
		page => page.id === websiteMetadata.homeReference.pageId
	)

	const homePage: PageOutput = {
		id: homeMetadata.id,
		name: homeMetadata.name,
		distPath: `index.html`,
		content: renderPage({
			pageMetadata: homeMetadata,
			websiteMetadata
		})
	}

	//
	// generate articles
	//

	const articlePages: PageOutput[] = websiteMetadata.articleReferences.map(
		articleMetadata => {
			const pageMetadata = websiteMetadata.pages.find(
				page => page.id === articleMetadata.pageId
			)
			const choppedPath = regex(/articles\/(.+)/i, pageMetadata.sourcePath)
			return {
				id: pageMetadata.id,
				name: pageMetadata.name,
				distPath: `${choppedPath}/index.html`,
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

	const blogPosts: PageOutput[] = websiteMetadata.blogPostReferences.map(
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
		page => page.id === websiteMetadata.blogIndexReference.pageId
	)

	const blogIndex: PageOutput = {
		id: blogIndexPage.id,
		name: blogIndexPage.name,
		distPath: `blog/index.html`,
		content: renderBlogIndex({
			pageMetadata: blogIndexPage,
			websiteMetadata,
			blogIndexMetadata: websiteMetadata.blogIndexReference
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
