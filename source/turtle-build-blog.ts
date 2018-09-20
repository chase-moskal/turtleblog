
import {TurtleBuildBlogOptions} from "./interfaces"

import {loadPages} from "./turtle/load-pages"
import {generatePages} from "./turtle/generate-pages"
import {loadBlogPosts} from "./turtle/load-blog-posts"
import {generateBlogIndex} from "./turtle/generate-blog-index"
import {generateBlogPosts} from "./turtle/generate-blog-posts"

export async function turtleBuildBlog({
	source = "source",
	dist = "dist",
	blog = "blog",
	pageLabeler = page => page === "index" ? "home" : page,
	pageLinker = page => page === "index" ? "/" : `/${page}/`
}: Partial<TurtleBuildBlogOptions>): Promise<void> {

	const [pages, blogPosts] = await Promise.all([
		await loadPages({source, pageLabeler, pageLinker}),
		await loadBlogPosts({source, dist, blog})
	])

	await Promise.all([
		generatePages({source, dist, pages}),
		generateBlogIndex({source, dist, pages, blog, blogPosts}),
		generateBlogPosts({source, dist, pages, blog, blogPosts})
	])
}
