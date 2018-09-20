
export interface TurtleOptions {
	dist: string
	source: string
}

export interface TurtleBlogOptions extends TurtleOptions {
	blog: string
}

export interface TurtleBuildBlogOptions extends TurtleBlogOptions {
	pageLinker?: (page: string) => string
	pageLabeler?: (page: string) => string
}
