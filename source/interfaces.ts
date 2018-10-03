
/*

path terminology

- sourcePath: path within the source dir
- distPath: path within the dist dir
- fullSourcePath: includes source dir
- fullDistPath: includes dist dir

*/

export type Id = string

//
// WEBSITE METADATA
// - data about website source material
// - is the result of turtle-read function
// - is the input for turtle-generate function
//

export interface WebsiteMetadata {
	source: string
	pages: PageMetadata[]
	homeReference: HomeReference
	articleReferences: ArticleReference[]
	blogPostReferences: BlogPostReference[]
	blogIndexReference: BlogIndexReference
	navigationLinkReferences: NavigationLinkReference[]
}

export interface PageMetadata {
	id: Id
	name: string
	link: string
	title: string
	sourcePath: string
	sections: PageSectionMetadata[]
}

export interface PageSectionMetadata {
	name: string
	title: string
	content: string
}

export interface PageReferenceMetadata {
	pageId: Id
}

export interface HomeReference extends PageReferenceMetadata {}

export interface ArticleReference extends PageReferenceMetadata {}

export interface NavigationLinkReference extends PageReferenceMetadata {}

export interface BlogPostReference extends PageReferenceMetadata {
	date: string
}

export interface BlogIndexReference extends PageReferenceMetadata {}

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

export interface FileCopyOutput {
	sourceFilePath: string
	distDirPath: string
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
