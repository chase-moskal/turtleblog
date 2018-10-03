
export interface FileSystemItem {
	name: string
	path: string
	isDirectory: boolean
}

export interface FileSystemTree extends FileSystemItem {
	children: FileSystemTree[]
}
