
export type Id = string

export interface PageData {
	id: Id
	sourcePath: string
	markdowns: MarkdownData[]
	pugTemplate: PugTemplate | null
	files: string[]
}

export interface PageContext {
	id: Id
	name: string
	link: string
	title: string
	sections: SectionData[]
	// navigation: any[]
}

export interface PageFinal {
	id: Id
	html: string
	distPath: string
	fileCopies: FileCopyOutput[]
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
	fullSourceFilePath: string
	distDirPath: string
}
