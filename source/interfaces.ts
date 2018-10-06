
/*

path terminology

- sourcePath: path within the source dir
- distPath: path within the dist dir
- fullSourcePath: includes source dir
- fullDistPath: includes dist dir

*/

import {PageData, Id, FileCopyOutput} from "./pages/interfaces"

//
// WEBSITE METADATA
// - data about website source material
// - is the result of turtle-read function
// - is the input for turtle-generate function
//

export interface WebsiteMetadata {
	source: string
	pages: PageData[]
	homeReference: HomeReference
	articleReferences: ArticleReference[]
	blogIndexReference: BlogIndexReference
	blogPostReferences: BlogPostReference[]
	navigationReferences: NavigationReference[]
}

export interface PageReference {
	pageId: Id
}

export interface HomeReference extends PageReference {}

export interface ArticleReference extends PageReference {}

export interface NavigationReference extends PageReference {}

export interface BlogPostReference extends PageReference {
	date: string
}

export interface BlogIndexReference extends PageReference {}

//
// WEBSITE OUTPUT
// - final json output for website contents to be written to disk
// - is the result of turtle-generate function
// - is the input for turtle-write function
//

export interface WebsiteOutput {
	pages: PageOutput[]
}

export interface PageOutput {
	id: Id
	name: string
	distPath: string
	content: string
	files: FileCopyOutput[]
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
	blogDir: string
	homeName: string
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
