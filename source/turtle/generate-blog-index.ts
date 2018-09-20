
import * as fs from "fs"
import * as pug from "pug"
import {promisify} from "util"
import * as shell from "shelljs"
import * as MarkdownIt from "markdown-it"

import {GenerateBlogOptions} from "./interfaces"

const readFile = promisify(fs.readFile)
const writeFile = promisify(fs.writeFile)
const markdownIt = new MarkdownIt({html: true})

export async function generateBlogIndex({source, dist, blog, pages, blogPosts}: GenerateBlogOptions): Promise<void> {
	const pugRenderPage = pug.compileFile(`${source}/layouts/blog-index.pug`)
	const markdownContent = await readFile(`${source}/blog/index.md`, "utf8")
	const content = markdownIt.render(markdownContent)
	const html = pugRenderPage({
		blog,
		pages,
		content,
		blogPosts
	})
	shell.mkdir("-p", `${dist}/${blog}`)
	await writeFile(`${dist}/${blog}/index.html`, html, "utf8")
}
