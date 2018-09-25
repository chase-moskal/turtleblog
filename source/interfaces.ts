
export interface PageSection {
	name: string
	title: string
	content: string
}

export type Id = string

export interface Page {
	id: Id
	name: string
	title: string
	link: string
	path: string
	sections: PageSection[]
}

export interface NavigationItem {
	pageId: Id
}

export interface BlogPost {
	pageId: Id
	date: string
}

export interface Website {
	pages: Page[]
	navigation: NavigationItem[]
	blogPosts: BlogPost[]
}

export interface TurtleReadOptions {
	source: string
}

export interface TurtleTransformOptions {
	website: Website
}

export interface TurtleWriteOptions {
	dist: string
	website: Website
}

export type TurtleReader = (options: TurtleReadOptions) => Promise<Website>

export type TurtleTransformer = (options: TurtleTransformOptions) => Promise<Website>

export type TurtleWriter = (options: TurtleWriteOptions) => Promise<void>
