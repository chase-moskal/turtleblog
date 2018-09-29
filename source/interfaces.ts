
export type Id = string

////////
////////

export interface WebsiteMetadata {
	source: string
	pages: PageMetadata[]
	articles: ArticleMetadata[]
	blogPosts: BlogPostMetadata[]
	blogIndex: BlogIndexMetadata
	navigation: NavigationLinkMetadata[]
}

export interface PageMetadata {
	id: Id
	name: string
	title: string
	link: string
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

export interface ArticleMetadata extends PageReferenceMetadata {}

export interface NavigationLinkMetadata extends PageReferenceMetadata {}

export interface BlogPostMetadata extends PageReferenceMetadata {
	date: string
}

export interface BlogIndexMetadata extends PageReferenceMetadata {}

////////
////////

export interface WebsiteOutput {
	pages: PageOutput[]
}

export interface PageOutput {
	id: Id
	path: string
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

////////
////////

export interface TurtleReadOptions {
	source: string
}

export interface TurtleGenerateOptions {
	websiteMetadata: WebsiteMetadata
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
