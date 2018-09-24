
import * as pug from "pug"
import * as shell from "shelljs"

import {regex} from "../toolbox/regex"
import {listFiles} from "../files/list-files"
import {readFile, writeFile} from "../files/fsc"
import {GeneratePageOptions} from "./interfaces"

const isMarkdown = file => /.+\.md$/i.test(file)
const isLayout = file => file === "layout.pug"

export async function generatePage({
	dist,
	name,
	title,
	source,
	isIndex,
	standardLayoutPath,
	locals = {}
}: GeneratePageOptions) {

	const sourcePagePath = `${source}/${name}`
	const distPagePath = `${dist}/${name}`
	const files = await listFiles(sourcePagePath)
	const markdownFiles = files.filter(isMarkdown)

	// gather up markdown sections
	const sections = Promise.all(markdownFiles.map(async markdownFile => {
		const name = regex(/(?:(\d+)-|)(.+)\..+/i, markdownFile, 2)
		const markdownPath = `${sourcePagePath}/${markdownFile}`
		const html = await readFile(markdownPath)
		return {name, html}
	}))

	// compile the page html
	const layoutFile = files.find(isLayout)
	const layoutPath = layoutFile ? `${source}/${layoutFile}` : standardLayoutPath
	const pugRender = pug.compileFile(layoutPath)
	const html = pugRender({...locals, title, sections})

	// save the page html
	const dirBase = isIndex ? dist : distPagePath
	shell.mkdir("-p", dirBase)
	const writePath = isIndex
		? `${dirBase}/index.html`
		: `${dirBase}/${name}.html`
	await writeFile(writePath, html)

	console.log("SAVED", writePath, name)

	// copy over side files
	const sideFiles = files.filter(file => !isMarkdown(file) && !isLayout(file))
	for (const file of sideFiles) {
		shell.cp(`${sourcePagePath}/${file}`, dirBase)
	}
}
