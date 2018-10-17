
/*

path terminology

- sourceDir: source base directory
- sourcePath: path within the source dir
- sourcePathFull: source path which includes source dir
- distDir: dist base directory
- distPath: path within the dist dir
- distPathFull: dist path which includes dist dir

*/

import {TreeNode} from "./toolbox/tree-node"
import {
	Id,
	PageData,
	PugTemplate,
	FileCopyOutput,
	PageContext
} from "./pages/interfaces"

//
// WEBSITE DATA
// - data about website source material
// - is the result of turtle-read function
// - is the input for turtle-generate function
//

export interface WebsiteData {
	sourceDir: string
	pages: PageData[]
	styles: StyleData[]
	templates: WebsiteTemplates
	references: {
		home: PageReference
		blogIndex: PageReference
		blogPosts: PageReference[]
		articles: PageReference[]
		articleTree: TreeNode<PageReference>
	}
}

export interface WebsiteTemplates {
	home: PugTemplate
	article: PugTemplate
	blogIndex: PugTemplate
	blogPost: PugTemplate
}

export interface PageReference {
	pageId: Id
}

export interface StyleData {
	scss: string
	sourcePath: string
}

//
// WEBSITE OUTPUT
// - final json output for website contents to be written to disk
// - is the result of turtle-generate function
// - is the input for turtle-write function
//

export interface WebsiteOutput {
	pages: PageOutput[]
	styles: StyleOutput[]
}

export interface PageOutput {
	id: Id
	name: string
	html: string
	distPath: string
	context: PageContext
	files: FileCopyOutput[]
}

export interface StyleOutput {
	css: string
	distPath: string
}

export interface PageReferenceOutput {
	pageId: Id
}

export interface ArticleOutput extends PageReferenceOutput {}

export interface BlogPostOutput extends PageReferenceOutput {
	date: string
}

export interface NavigationLinkOutput extends PageReferenceOutput {}

//
// TURTLE FUNCTION SIGNATURES
// - signature for each major function
// - interfaces for the options too
//

export type TurtleReader = (options: TurtleReadOptions) =>
	Promise<WebsiteData>

export type TurtleGenerator = (options: TurtleGenerateOptions) =>
	Promise<WebsiteOutput>

export type TurtleDataTransformer =
	(options: TurtleDataTransformOptions) =>
		Promise<WebsiteData>

export type TurtleOutputTransformer =
	(options: TurtleOutputTransformOptions) =>
		Promise<WebsiteOutput>

export type TurtleWriter = (options: TurtleWriteOptions) =>
		Promise<void>

export interface TurtleReadOptions {
	sourceDir: string
	siteTitle: string
}

export interface TurtleGenerateOptions {
	blogDir: string
	websiteData: WebsiteData
}

export interface TurtleDataTransformOptions {
	websiteData: WebsiteData
}

export interface TurtleOutputTransformOptions {
	websiteOutput: WebsiteOutput
}

export interface TurtleWriteOptions {
	distDir: string
	websiteOutput: WebsiteOutput
}
