
import * as pug from "pug"
import * as glob from "fast-glob"
import * as shortid from "shortid"
import * as MarkdownIt from "markdown-it"

import {readFile} from "./files/fsc"
import {regex} from "./toolbox/regex"
import {listFiles} from "./files/list-files"
import {listDirectories} from "./files/list-directories"

import {
	Website,
	TurtleReader,
	Page,
	PageSection,
	PageOutput
} from "./interfaces"

const generateId = () => shortid.generate()

const markdownIt = new MarkdownIt({html: true})

const nameToTitle = (name: string) => name.replace(/-/g, " ")

// const readPage = async(pageName: string, path: string): Promise<Page> => {
// 	const files = await listFiles(path)
// 	const markdownFiles = files.filter(filename => /\.md$/i.test(filename))
// 	const sections = await Promise.all(markdownFiles.map(async (filename): Promise<PageSection> => {
// 		const markdown = await readFile(`${path}/${filename}`)
// 		const sectionName = regex(/^(?:|(\d+)-)(.+)\.md$/i, filename, 2)
// 		const content = markdownIt.render(markdown)
// 		return {
// 			name: sectionName,
// 			title: nameToTitle(sectionName),
// 			content
// 		}
// 	}))
// 	return {
// 		id: generateId(),
// 		name: pageName,
// 		title: nameToTitle(pageName),
// 		link: `/${pageName}`,
// 		sections
// 	}
// }

export const turtleRead: TurtleReader = async({source}) => {

	// initialized website object
	const website: Website = {
		pages: [],
		blogPosts: [],
		navigation: []
	}

	// prepare pug layouts
	const renderPage = pug.compileFile(`${source}/layouts/page.pug`)
	const renderBlogIndex = pug.compileFile(`${source}/layouts/blog-index.pug`)
	const renderBlogPost = pug.compileFile(`${source}/layouts/blog-post.pug`)

	// prepare pages
	const pageDirectories = await listDirectories(`${source}/pages`)
	const pages = await Promise.all(pageDirectories.map(async (pageDir): Promise<Page> => {
		// const pagePath = `${source}/pages/${pageDir}`
		// const pageFiles = await listFiles(pagePath)
		// const markdownFiles = pageFiles.filter(filename => /.+\.md$/i.test(filename))
		// const pageSections: PageSection[] = markdownFiles.map(filename => {
			
		// })
		return {
			id: generateId(),
			link: `/${pageDir}`,
			name: pageDir,
			title: nameToTitle(pageDir),
			sections: []
		}
	}))

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
