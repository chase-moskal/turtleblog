
import * as pug from "pug"
import {TurtleGenerator, PageOutput} from "./interfaces"

export const turtleGenerate: TurtleGenerator = async({websiteMetadata}) => {
	const {source} = websiteMetadata

	const renderPage = pug.compileFile(`${source}/layouts/page.pug`)
	const renderBlogPost = pug.compileFile(`${source}/layouts/blog-post.pug`)
	const renderBlogIndex = pug.compileFile(`${source}/layouts/blog-index.pug`)

	const articlePages: PageOutput[] = websiteMetadata.articles.map(
		articleMetadata => {
			const pageMetadata = websiteMetadata.pages.find(
				page => page.id === articleMetadata.pageId
			)
			const isHome = pageMetadata.id === websiteMetadata.homeId
			return {
				id: pageMetadata.id,
				name: pageMetadata.name,
				path: isHome
					? `index.html`
					: `${pageMetadata.name}/index.html`,
				content: renderPage({
					pageMetadata,
					websiteMetadata,
					articleMetadata
				}),
				files: []
			}
		}
	)

	const blogPosts: PageOutput[] = websiteMetadata.blogPosts.map(
		blogPostMetadata => {
			const pageMetadata = websiteMetadata.pages.find(
				page => page.id === blogPostMetadata.pageId
			)
			return {
				id: pageMetadata.id,
				name: pageMetadata.name,
				path: `blog/${blogPostMetadata.date}/${pageMetadata.name}/index.html`,
				content: renderBlogPost({
					pageMetadata,
					websiteMetadata,
					blogPostMetadata
				}),
				files: []
			}
		}
	)

	const blogIndexPage = websiteMetadata.pages.find(
		page => page.id === websiteMetadata.blogIndex.pageId
	)

	const blogIndex: PageOutput = {
		id: blogIndexPage.id,
		name: blogIndexPage.name,
		path: `blog/index.html`,
		content: renderBlogIndex({
			pageMetadata: blogIndexPage,
			websiteMetadata,
			blogIndexMetadata: websiteMetadata.blogIndex
		}),
		files: []
	}

	return {
		pages: [...articlePages, ...blogPosts, blogIndex]
	}
}
