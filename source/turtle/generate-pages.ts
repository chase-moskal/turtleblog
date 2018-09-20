
import * as fs from "fs"
import * as pug from "pug"
import {promisify} from "util"
import * as shell from "shelljs"
import * as MarkdownIt from "markdown-it"

import {GeneratePagesOptions} from "./interfaces"

const readFile = promisify(fs.readFile)
const writeFile = promisify(fs.writeFile)
const markdownIt = new MarkdownIt({html: true})

export async function generatePages({source, dist, pages}: GeneratePagesOptions): Promise<void> {

	const pugRenderPage = pug.compileFile(`${source}/layouts/page.pug`)

	for (const page of pages) {
		const markdownContent = await readFile(`${source}/pages/${page.name}.md`, "utf8")
		const content = markdownIt.render(markdownContent)
		const html = pugRenderPage({
			page,
			pages,
			content
		})

		if (/^index$/i.test(page.name)) {
			await writeFile(`${dist}/index.html`, html, "utf8")
		}

		else {
			shell.mkdir("-p", `${dist}/${page.name}`)
			await writeFile(`${dist}/${page.name}/index.html`, html, "utf8")
		}
	}
}
