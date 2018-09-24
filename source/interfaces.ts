
export interface TurtleOptions {
	dist: string
	source: string
}

export interface TurtleBlogOptions extends TurtleOptions {
	blog: string
}

export interface TurtleBuildBlogOptions extends TurtleBlogOptions {
	pageTitler?: (page: string) => string
	pageLinker?: (page: string) => string
	pageIsIndex?: (page: string) => boolean
}

export interface TurtleBlogPageSection {
	name: string
	title: string
}

export interface TurtleBlogPage {
	name: string
	title: string
	link: string
	path: string
	sections: TurtleBlogPageSection[]
}

export interface TurtleBlogWebsite {
	pages: TurtleBlogPage[]
}
