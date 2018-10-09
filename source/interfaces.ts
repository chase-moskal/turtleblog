
/*

path terminology

- sourcePath: path within the source dir
- distPath: path within the dist dir
- fullSourcePath: includes source dir
- fullDistPath: includes dist dir

*/

import {TreeNode} from "./toolbox/tree-node"
import {PageData, Id, FileCopyOutput, PugTemplate} from "./pages/interfaces"

//
// WEBSITE METADATA
// - data about website source material
// - is the result of turtle-read function
// - is the input for turtle-generate function
//

export interface WebsiteMetadata {
	source: string
	styles: StyleMetadata[]
	templates: WebsiteTemplates
	pages: PageData[]
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

export interface StyleMetadata {
	data: string
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
	distPath: string
	content: string
	files: FileCopyOutput[]
}

export interface StyleOutput {
	data: string
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
	Promise<WebsiteMetadata>

export type TurtleGenerator = (options: TurtleGenerateOptions) =>
	Promise<WebsiteOutput>

export type TurtleMetadataTransformer =
	(options: TurtleMetadataTransformOptions) =>
		Promise<WebsiteMetadata>

export type TurtleOutputTransformer =
	(options: TurtleOutputTransformOptions) =>
		Promise<WebsiteOutput>

export type TurtleWriter = (options: TurtleWriteOptions) =>
		Promise<void>

export interface TurtleReadOptions {
	source: string
}

export interface TurtleGenerateOptions {
	websiteMetadata: WebsiteMetadata
	// blogDir: string
	// homeName: string
}

export interface TurtleMetadataTransformOptions {
	websiteMetadata: WebsiteMetadata
}

export interface TurtleOutputTransformOptions {
	websiteOutput: WebsiteOutput
}

export interface TurtleWriteOptions {
	dist: string
	websiteOutput: WebsiteOutput
}
