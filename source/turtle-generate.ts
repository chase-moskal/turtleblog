
import * as path from "path"
import * as sass from "sass"
import {promisify} from "util"
import * as fiber from "fibers"

import {PageData} from "./pages/interfaces"
import {TurtleGenerator, PageReference} from "./interfaces"

const sassRender = promisify(sass.render)

/**
 * Generate a turtle website
 */
export const turtleGenerate: TurtleGenerator = async({websiteMetadata}) => {
	const {source} = websiteMetadata

	function getPageById({pageId}: PageReference): PageData {
		const page = websiteMetadata.pages.find(page => page.id === pageId)
		if (!page) throw new Error(`page id not found "${page.id}"`)
		return page
	}

	//
	// obtain page data
	//

	const home = getPageById(websiteMetadata.references.home)
	const blogIndex = getPageById(websiteMetadata.references.blogIndex)
	const blogPosts = websiteMetadata.references.blogPosts.map(getPageById)
	const articles = websiteMetadata.references.articles.map(getPageById)

	return {

		//
		// page outputs
		//

		pages: [

			// home page
			{
				id: home.id,
				name: "home",
				distPath: "index.html",
				content: "",
				files: home.files.map(file => ({
					fullSourceFilePath: `${source}/${home.sourcePath}/${file}`,
					distDirPath: ""
				}))
			},
	
			// blog index
			{
				id: blogIndex.id,
				name: "blog-index",
				distPath: "blog/index.html",
				content: "",
				files: blogIndex.files.map(file => ({
					fullSourceFilePath: `${source}/${home.sourcePath}/${file}`,
					distDirPath: ""
				}))
			},
	
			// blog posts
			...blogPosts.map(page => ({
				id: page.id,
				name: path.basename(page.sourcePath),
				distPath: page.sourcePath.replace(/^blog\//i, "") + "/index.html",
				content: "",
				files: page.files.map(filename => ({
					fullSourceFilePath: `${source}/${page.sourcePath}/${filename}`,
					distDirPath: page.sourcePath
				}))
			})),
	
			// articles
			...articles.map(page => ({
				id: page.id,
				name: path.basename(page.sourcePath),
				distPath: page.sourcePath.replace(/^articles\//i, "") + "/index.html",
				content: "",
				files: page.files.map(filename => ({
					fullSourceFilePath: `${source}/${page.sourcePath}/${filename}`,
					distDirPath: page.sourcePath
				}))
			}))
		],

		//
		// scss stylesheets
		//

		styles: await Promise.all(
			websiteMetadata.styles.map(async({data, sourcePath}) => {
				const sassResult = await sassRender({data, includePaths: [source], fiber})
				return {
					data: sassResult.css.toString("utf8"),
					distPath: sourcePath.replace(/\.scss$/i, ".css")
				}
			})
		)
	}
}
