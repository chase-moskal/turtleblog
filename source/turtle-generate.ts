
import * as path from "path"
import {TurtleGenerator} from "./interfaces"

// import {compile} from "pug"
// import {readFile} from "./files/fsc"
// import {pageRead} from "./pages/page-read"
// import {PageData} from "./pages/interfaces"
// import {listItemTree} from "./files/list-item-tree"
// import {listDirectories} from "./files/list-directories"

/**
 * Read a turtle website directory and return website metadata
 */
export const turtleGenerate: TurtleGenerator = async({websiteMetadata}) => {
	const {source, pages, references} = websiteMetadata
	return {
		pages: websiteMetadata.pages.map(page => {
			return {
				id: page.id,
				name: path.basename(page.sourcePath),
				distPath: page.sourcePath,
				content: "",
				files: page.files.map(filename => ({
					fullSourceFilePath: `${source}/${page.sourcePath}/${filename}`,
					distDirPath: page.sourcePath
				}))
			}
		})
	}
}
