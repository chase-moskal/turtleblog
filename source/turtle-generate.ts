
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
	MarkdownData,
	SectionData
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
export const turtleGenerate: TurtleGenerator = async({websiteMetadata}) => {
	const {source} = websiteMetadata

	//
	// utility functions
	//

	function getPageById({pageId}: PageReference): PageData {
		const page = websiteMetadata.pages.find(page => page.id === pageId)
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
		home: compilePugRenderer(websiteMetadata.templates.home),
		blogIndex: compilePugRenderer(websiteMetadata.templates.blogIndex),
		blogPost: compilePugRenderer(websiteMetadata.templates.blogPost),
		article: compilePugRenderer(websiteMetadata.templates.article)
	}

	//
	// prepare navigation tree
	//

	const navigation = new TreeNode<PageReference>(undefined, true)
	navigation.addChildValue(websiteMetadata.references.home)
	navigation.addChildValue(websiteMetadata.references.blogIndex)
	for (const articleNode of websiteMetadata.references.articleTree.children)
		navigation.addChildNode(articleNode)

	//
	// page-specific generators
	//

	async function generateHomePage(data: PageData): Promise<PageOutput> {
		const pugRenderer = (data.pugTemplate)
			? compilePugRenderer(data.pugTemplate)
			: pugRenderers.home

		const pageContext: PageContext = {
			id: data.id,
			type: "home",
			name: "home",
			link: "/",
			title: "home",
			sections: renderMarkdownsToSections(data.markdowns),
			navigation
		}

		return {
			id: data.id,
			name: "home",
			distPath: "index.html",
			content: pugRenderer({pageContext, websiteMetadata}),
			files: home.files.map(file => ({
				fullSourceFilePath: `${source}/${home.sourcePath}/${file}`,
				distDirPath: ""
			}))
		}
	}

	async function generateBlogIndex(data: PageData): Promise<PageOutput> {
		const pugRenderer = (data.pugTemplate)
			? compilePugRenderer(data.pugTemplate)
			: pugRenderers.blogIndex

		const pageContext: PageContext = {
			id: data.id,
			type: "blog-index",
			name: "blog-index",
			link: "/",
			title: "blog index",
			sections: renderMarkdownsToSections(data.markdowns),
			navigation
		}

		return {
			id: data.id,
			name: "home",
			distPath: "blog/index.html",
			content: pugRenderer({pageContext, websiteMetadata}),
			files: home.files.map(file => ({
				fullSourceFilePath: `${source}/${home.sourcePath}/${file}`,
				distDirPath: "blog"
			}))
		}
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
			await generateHomePage(home),
	
			// blog index
			await generateBlogIndex(blogIndex),
	
			// blog posts
			...blogPosts.map(page => ({
				id: page.id,
				type: "blog-post",
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
				type: "article",
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
