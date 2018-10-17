
import * as pug from "pug"
import * as path from "path"
import * as MarkdownIt from "markdown-it"

import {TreeNode} from "../toolbox/tree-node"
import {PageOutput, PageReference, WebsiteData} from "../interfaces"

import {
	PageData,
	PageContext,
	PugTemplate,
	MarkdownData,
	SectionData
} from "./interfaces"

const markdownIt = new MarkdownIt({html: true})

const compilePugRenderer = (template: PugTemplate) =>
	pug.compile(template.pugContent, {
		basedir: path.dirname(template.path),
		filename: template.path
	})

function renderMarkdownsToSections(markdowns: MarkdownData[]): SectionData[] {
	return markdowns.map(({markdown, filename}) => {
		const name = path.parse(filename).name
		const title = name.replace(/-/, " ")
		const html = markdownIt.render(markdown)
		return {name, title, html}
	})
}

export async function pageGenerate({
	type,
	pageData,
	sourceDir,
	navigation,
	websiteData,
	fallbackPugRenderer,
	sourcePathToDistPath = sourcePath => sourcePath,
	distPathToLink = distPath => "/" + distPath.replace(/index\.html$/i, "")
}: {
	type: string
	sourceDir: string
	pageData: PageData
	websiteData: WebsiteData
	navigation: TreeNode<PageReference>
	fallbackPugRenderer: pug.compileTemplate
	sourcePathToDistPath?: (sourcePath: string) => string
	distPathToLink?: (distPath: string) => string
}): Promise<PageOutput> {

	const pugRenderer = (pageData.pugTemplate)
		? compilePugRenderer(pageData.pugTemplate)
		: fallbackPugRenderer

	const distPath = sourcePathToDistPath(pageData.sourcePath)

	const pageContext: PageContext = {
		id: pageData.id,
		type,
		details: pageData.details,
		link: distPathToLink(distPath),
		sections: renderMarkdownsToSections(pageData.markdowns),
		navigation
	}

	const output: PageOutput = {
		id: pageData.id,
		name: pageContext.details.name,
		distPath,
		html: pugRenderer({pageContext, websiteData}),
		context: pageContext,
		files: pageData.otherFileNames.map(file => ({
			sourcePathFull: `${sourceDir}/${pageData.sourcePath}/${file}`,
			distDirPath: path.dirname(distPath).replace("^\/", "")
		}))
	}

	return output
}
