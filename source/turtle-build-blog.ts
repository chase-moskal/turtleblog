
import {TurtleBuildBlogOptions} from "./interfaces"
import {generatePage} from "./turtle/generate-page"
import {listDirectories} from "./files/list-directories"
import {loadBlogDirectories} from "./turtle/load-blog-directories"

export async function turtleBuildBlog({
	source = "source",
	dist = "dist",
	blog = "blog",
	pageTitler = page => page.replace(/-/g, " "),
	pageLinker = page => page === "index" ? "/" : `/${page}/`,
	pageIsIndex = page => page === "home"
}: Partial<TurtleBuildBlogOptions>): Promise<void> {

	const pageDirectories = await listDirectories(`${source}/pages`)
	const blogDirectories = await loadBlogDirectories({source, blog})
	const pages = []

	console.log("PAGE DIRS", pageDirectories)

	for (const pageDirectory of pageDirectories) {
		generatePage({
			source: `${source}/pages`,
			dist: `${dist}`,
			name: pageDirectory,
			title: pageTitler(pageDirectory),
			standardLayoutPath: `${source}/layouts/page.pug`,
			locals: {pages},
			isIndex: pageDirectory === "home"
		})
	}
}
