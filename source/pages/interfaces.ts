
import {PageReference} from "../interfaces"
import {TreeNode} from "../toolbox/tree-node"

export type Id = string

export interface PageData {
	id: Id
	details: PageDetails
	sourcePath: string
	markdowns: MarkdownData[]
	pugTemplate: PugTemplate | null
	otherFileNames: string[]
}

export interface PageDetails {
	name: string
	title: string
	[key: string]: any
}

export interface PageContext {
	id: Id
	type: string
	link: string
	details: PageDetails
	sections: SectionData[]
	navigation: TreeNode<PageReference>
}

export interface PugTemplate {
	path: string
	pugContent: string
}

export interface MarkdownData {
	filename: string
	markdown: string
}

export interface MarkdownData {
	filename: string
	markdown: string
}

export interface SectionData {
	name: string
	title: string
	html: string
}

export interface FileCopyOutput {
	sourcePathFull: string
	distDirPath: string
}
