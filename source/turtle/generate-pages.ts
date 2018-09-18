
import * as fs from "fs"
import * as pug from "pug"
import {promisify} from "util"
import * as shell from "shelljs"

import {GeneratePagesOptions} from "./interfaces"

const writeFile = promisify(fs.writeFile)

export async function generatePages({source, dist, pages}: GeneratePagesOptions): Promise<void> {

	const pugRenderPage = pug.compileFile(`${source}/layouts/page.pug`)

	for (const page of pages) {
		const html = pugRenderPage({page, pages})

		if (/^index$/i.test(page)) {
			await writeFile(`${dist}/index.html`, html, "utf8")
		}

		else {
			shell.mkdir("-p", `${dist}/${page}`)
			await writeFile(`${dist}/${page}/index.html`, html, "utf8")
		}
	}
}
