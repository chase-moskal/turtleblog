
import {TurtleOptions, TurtleBlogOptions} from "../interfaces"

export interface Resource {
	name: string
	link: string
}

export interface BlogPost extends Resource{
	author: string
}

export interface GeneratePagesOptions extends TurtleOptions {
	pages: string[]
}

export interface GenerateBlogOptions extends TurtleBlogOptions {
	pages: string[]
	blogPosts: BlogPost[]
}
