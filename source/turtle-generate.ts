
import * as pug from "pug"
import * as path from "path"
import * as sass from "sass"
import {promisify} from "util"
import * as fiber from "fibers"

import {TreeNode} from "./toolbox/tree-node"
import {pageGenerate} from "./pages/page-generate"
import {
	PageData,
	PugTemplate
} from "./pages/interfaces"

import {TurtleGenerator, PageReference} from "./interfaces"

const sassRender = promisify(sass.render)

const compilePugRenderer = (template: PugTemplate) =>
	pug.compile(template.pugContent, {
		basedir: path.dirname(template.path),
		filename: template.path
	})

/**
 * Generate a turtle website
 */
export const turtleGenerate: TurtleGenerator = async({blogDir, websiteData}) => {
	const {sourceDir} = websiteData

	//
	// utility functions
	//

	function getPageById({pageId}: PageReference): PageData {
		const page = websiteData.pages.find(page => page.id === pageId)
		if (!page) throw new Error(`page id not found "${page.id}"`)
		return page
	}

	//
	// prepare standard pug template renderers
	//

	const pugRenderers = {
		home: compilePugRenderer(websiteData.templates.home),
		blogIndex: compilePugRenderer(websiteData.templates.blogIndex),
		blogPost: compilePugRenderer(websiteData.templates.blogPost),
		article: compilePugRenderer(websiteData.templates.article)
	}

	//
	// prepare navigation tree
	//

	const navigation = new TreeNode<PageReference>(undefined, true)
	navigation.addChildValue(websiteData.references.home)
	navigation.addChildValue(websiteData.references.blogIndex)
	for (const articleNode of websiteData.references.articleTree.children)
		navigation.addChildNode(articleNode)

	//
	// obtain page data
	//

	const blogPosts = websiteData.references.blogPosts.map(getPageById)
	const articles = websiteData.references.articles.map(getPageById)

	return {

		//
		// page outputs
		//

		pages: [

			// home page
			await pageGenerate({
				sourceDir,
				navigation,
				websiteData,
				type: "home",
				fallbackPugRenderer: pugRenderers.home,
				sourcePathToDistPath: () => "index.html",
				pageData: getPageById(websiteData.references.home)
			}),

			// blog index
			await pageGenerate({
				sourceDir,
				navigation,
				websiteData,
				type: "blog-index",
				fallbackPugRenderer: pugRenderers.blogIndex,
				pageData: getPageById(websiteData.references.blogIndex),
				sourcePathToDistPath: () => `${blogDir}/index.html`
			}),

			// blog posts
			...await Promise.all(blogPosts.map(async pageData => pageGenerate({
				pageData,
				sourceDir,
				navigation,
				websiteData,
				type: "blog-post",
				fallbackPugRenderer: pugRenderers.blogPost,
				sourcePathToDistPath: sourcePath => blogDir
					+ "/"
					+ sourcePath.replace(/^blog-posts\//i, "")
					+ "/index.html"
			}))),

			// articles
			...await Promise.all(articles.map(async pageData => pageGenerate({
				pageData,
				sourceDir,
				navigation,
				websiteData,
				type: "article",
				fallbackPugRenderer: pugRenderers.article,
				sourcePathToDistPath: sourcePath => "/"
					+ sourcePath.replace(/^articles\//i, "")
					+ "/index.html"
			})))
		],

		//
		// scss stylesheets
		//

		styles: await Promise.all(
			websiteData.styles.map(async({scss, sourcePath}) => {
				const sassResult = await sassRender({data: scss, includePaths: [sourceDir], fiber})
				return {
					css: sassResult.css.toString("utf8"),
					distPath: sourcePath.replace(/\.scss$/i, ".css")
				}
			})
		)
	}
}
