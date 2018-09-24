
const fs = require("fs")
const pug = require("pug")
const shell = require("shelljs")
const {promisify} = require("util")
const MarkdownIt = require("markdown-it")

const markdownIt = new MarkdownIt({html: true})
const readdir = promisify(fs.readdir)
const readFile = promisify(fs.readFile)
const writeFile = promisify(fs.writeFile)

/*

Expected file structure

	source/
		style.scss

		layouts/
			_mixins.pug
			page.pug
			blog-index.pug
			blog-post.pug

		pages/
			index.md # home page
			[page-url].md # top-level pages
			[page-url].md

			[page-url-and-title]/
				layout.pug # overrides layout
				1-[section-name].md
				2-[section-name].md
				attachment.zip
				picture.zip

			blog/
				index.md
				[year]/
					[month]/
						[day]/

							[post-url-and-title]/
								1-[author].md # post section markdowns are provided
								2-[author].md
								attachment.zip # any additional files are copied
								picture.jpg

							[post-url-and-title]/
								blog-post.pug # overrides layout
								1-[author].md # post section markdowns are provided
								2-[author].md
								attachment.zip # any additional files are copied
								picture.jpg

*/

dieOnError()

buildBlog({
	sourceDir: "source/devblog",
	destinationDir: "dist/devblog"
})

async function buildBlog({
	sourceDir,
	destinationDir
}) {
	const years = await listDirectories(sourceDir)
	const pugRenderArticle = pug.compileFile(`${sourceDir}/_article.pug`)
	const mention = p => console.log(`WRITE ${p}`)
	const allArticles = []

	for (const year of years) {
		const yearPath = `${sourceDir}/${year}`
		const months = await listDirectories(yearPath)

		for (const month of months) {
			const monthPath = `${yearPath}/${month}`
			const days = await listDirectories(monthPath)

			for (const day of days) {
				const dayPath = `${monthPath}/${day}`
				const articleDirs = await listDirectories(dayPath)

				for (const articleDir of articleDirs) {
					const articleDirPath = `${dayPath}/${articleDir}`
					const articleFiles = await listFiles(articleDirPath)
					const markdownFiles = articleFiles.filter(file => /\.md$/i.test(file))
					const otherFiles = articleFiles.filter(file => !/\.md$/i.test(file))

					// gather up the markdown posts
					const posts = await Promise.all(markdownFiles.map(async markdownFile => {
						const authorResults = /\d+-(.+)\..+/i.exec(markdownFile)
						const author = authorResults ? authorResults[1] : "unknown"
						const markdownFilePath = `${articleDirPath}/${markdownFile}`
						const markdownContent = markdownIt.render(await readFile(markdownFilePath, "utf8"))
						return {author, markdownContent}
					}))

					// compile the article html
					const articleTitle = articleDir.replace(/-/ig, " ")
					const articleHtml = pugRenderArticle({posts, articleTitle})
					const articleDestinationDir = `${destinationDir}/${year}/${month}/${day}/${articleDir}`
					const articleDestination = `${articleDestinationDir}/index.html`
					shell.mkdir("-p", articleDestinationDir)
					await writeFile(articleDestination, articleHtml, "utf8")
					mention(articleDestination)

					// copy other article files over
					for (const file of otherFiles) {
						shell.cp(`${articleDirPath}/${file}`, articleDestinationDir)
					}

					// add to the list of articles
					allArticles.push({
						title: articleTitle,
						link: `${year}/${month}/${day}/${articleDir}/`,
						date: `${year}-${month}-${day}`
					})
				}
			}
		}
	}

	// render the blog index
	const pugRenderBlogIndex = pug.compileFile(`${sourceDir}/_index.pug`)
	const indexHtml = pugRenderBlogIndex({allArticles})
	const indexDestination = `${destinationDir}/index.html`
	writeFile(indexDestination, indexHtml, "utf8")
	mention(indexDestination)
}

function dieOnError() {
	process.on("unhandledRejection", (reason, error) => {
		console.error(reason, error)
		process.exit(1)
	})
	
	process.on("uncaughtException", error => {
		console.error(error)
		process.exit(1)
	})
}

async function listContents(dir) {
	return readdir(dir, {
		encoding: "utf8",
		withFileTypes: true
	})
}

async function listFiles(dir) {
	return (await listContents(dir))
		.filter(dirent => dirent.isFile())
		.map(dirent => dirent.name)
}

async function listDirectories(dir) {
	return (await listContents(dir))
		.filter(dirent => dirent.isDirectory())
		.map(dirent => dirent.name)
}
