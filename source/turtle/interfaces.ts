
export interface GeneratePageOptions {

	/** Destination folder in which page directories are written */
	dist: string

	/** Name of the page for use in the url */
	name: string

	/** Name of the page for use in the title */
	title: string

	/** Source folder from which page directories are read */
	source: string

	/** Mark this page as a homepage to be saved as an index file */
	isIndex: boolean

	/** Path to the fallback layout file */
	standardLayoutPath: string

	/** Additional data to pass to the layout */
	locals?: any
}
