
import * as pug from "pug"
import * as path from "path"
import * as sass from "sass"
import {promisify} from "util"
import * as fiber from "fibers"
import * as MarkdownIt from "markdown-it"

import {TreeNode} from "./toolbox/tree-node"
import {TurtleGenerator, PageReference, PageOutput} from "./interfaces"
import {
	PageData,
	PugTemplate,
	PageContext,
	SectionData,
	MarkdownData
} from "./pages/interfaces"

const sassRender = promisify(sass.render)
const markdownIt = new MarkdownIt({html: true})

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

	function renderMarkdownsToSections(markdowns: MarkdownData[]): SectionData[] {
		return markdowns.map(({markdown, filename}) => {
			const name = path.parse(filename).name
			const title = name.replace(/-/, " ")
			const html = markdownIt.render(markdown)
			return {name, title, html}
		})
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
	// page-specific generators
	//

	async function generatePage({
		type,
		pageData,
		fallbackPugRenderer,
		sourcePathToDistPath = sourcePath => sourcePath,
		distPathToLink = distPath => "/" + distPath.replace(/index\.html$/i, "")
	}: {
		type: string
		pageData: PageData
		fallbackPugRenderer: pug.compileTemplate
		sourcePathToDistPath?: (sourcePath: string) => string
		distPathToLink?: (distPath: string) => string
	}): Promise<PageOutput> {

		const pugRenderer = (pageData.pugTemplate)
			? compilePugRenderer(pageData.pugTemplate)
			: fallbackPugRenderer

		const distPath = sourcePathToDistPath(pageData.sourcePath)

		const pageContext: PageContext = {
			id: pageData.id,
			type,
			details: pageData.details,
			link: distPathToLink(distPath),
			sections: renderMarkdownsToSections(pageData.markdowns),
			navigation
		}

		const output: PageOutput = {
			id: pageData.id,
			name: pageContext.details.name,
			distPath,
			html: pugRenderer({pageContext, websiteData}),
			context: pageContext,
			files: pageData.otherFileNames.map(file => ({
				sourcePathFull: `${sourceDir}/${pageData.sourcePath}/${file}`,
				distDirPath: path.dirname(distPath)
			}))
		}

		return output
	}

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
			await generatePage({
				type: "home",
				fallbackPugRenderer: pugRenderers.home,
				sourcePathToDistPath: () => "index.html",
				pageData: getPageById(websiteData.references.home)
			}),

			// blog index
			await generatePage({
				type: "blog-index",
				fallbackPugRenderer: pugRenderers.blogIndex,
				pageData: getPageById(websiteData.references.blogIndex),
				sourcePathToDistPath: () => `${blogDir}/index.html`
			}),

			// blog posts
			...await Promise.all(blogPosts.map(async pageData => generatePage({
				pageData,
				type: "blog-post",
				fallbackPugRenderer: pugRenderers.blogPost,
				sourcePathToDistPath: sourcePath => blogDir
					+ "/"
					+ sourcePath.replace(/^blog-posts\//i, "")
					+ "/index.html"
			}))),

			// articles
			...await Promise.all(articles.map(async pageData => generatePage({
				pageData,
				type: "article",
				sourcePathToDistPath: sourcePath => "/"
				+ sourcePath.replace(/^articles\//i, "")
				+ "/index.html",
				fallbackPugRenderer: pugRenderers.article
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
