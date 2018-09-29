
import * as pug from "pug"
import {TurtleGenerator} from "./interfaces"

export const turtleGenerate: TurtleGenerator = async({websiteMetadata}) => {
	const {source} = websiteMetadata

	const renderPage = pug.compileFile(`${source}/layouts/page.pug`)
	const renderBlogIndex = pug.compileFile(`${source}/layouts/blog-index.pug`)
	const renderBlogPost = pug.compileFile(`${source}/layouts/blog-post.pug`)

	return {
		pages: [
			{
				id: "abc123",
				path: "home/index.html",
				content: "<h1>Home page</h1>",
				files: []
			},
			{
				id: "bcd234",
				path: "blog/index.html",
				content: "<h1>Blog listing</h1>",
				files: []
			},
			{
				id: "cde345",
				path: "blog/2018/09/24/cool-update/index.html",
				content: "<h1>Cool update</h1>",
				files: []
			}
		]
	}
}
