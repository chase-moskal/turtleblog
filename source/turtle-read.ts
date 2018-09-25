
import * as pug from "pug"
import * as glob from "fast-glob"
import * as shortid from "shortid"

import {readFile} from "./files/fsc"
import {TurtleReader} from "./interfaces"

const generateId = () => shortid.generate()

export const turtleRead: TurtleReader = async({source}) => {

	// prepare pug layouts
	const renderPage = pug.compileFile(`${source}/layouts/page.pug`)
	const blogIndex = pug.compileFile(`${source}/layouts/blog-index.pug`)
	const blogPost = pug.compileFile(`${source}/layouts/blog-post.pug`)

	// prepare pages

	// prepare blog posts

	// prepare blog index

	// prepare navigation

	return {
		navigation: [
			{
				pageId: "abc123"
			},
			{
				pageId: "bcd234"
			}
		],
		blogPosts: [
			{
				pageId: "cde345",
				date: "2018/09/24"
			}
		],
		pages: [
			{
				id: "abc123",
				name: "home",
				title: "home",
				link: "/",
				path: "home/index.html",
				sections: [
					{
						name: "welcome",
						title: "welcome",
						content: "<h1>Welcome</h1>"
					}
				]
			},
			{
				id: "bcd234",
				name: "blog",
				title: "blog",
				link: "/blog/",
				path: "blog/index.html",
				sections: [
					{
						name: "blog-index",
						title: "blog listing",
						content: "<h1>Blog listing</h1>"
					}
				]
			},
			{
				id: "cde345",
				name: "cool-update",
				title: "cool update",
				link: "/blog/2018/09/24/cool-update/",
				path: "blog/index.html",
				sections: [
					{
						name: "blog-index",
						title: "blog listing",
						content: "<h1>Blog listing</h1>"
					}
				]
			}
		]
	}
}
