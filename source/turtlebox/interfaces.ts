
export type Id = string

export interface PageData {
	id: Id
	sourcePath: string
	markdowns: MarkdownData[]
	pugTemplate: string | null
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

export interface PageOutput {
	id: Id
	html: string
	distPath: string
	fileCopies: FileCopyOutput[]
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
	sourceFilePath: string
	distDirPath: string
}
