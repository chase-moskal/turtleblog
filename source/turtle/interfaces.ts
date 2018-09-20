
import {TurtleOptions, TurtleBlogOptions} from "../interfaces"

export interface BlogPost {
	link: string
	name: string
	author: string
}

export interface Page {
	link: string
	name: string
	label: string
}

export interface GeneratePagesOptions extends TurtleOptions {
	pages: Page[]
}

export interface GenerateBlogOptions extends GeneratePagesOptions, TurtleBlogOptions {
	blogPosts: BlogPost[]
}
