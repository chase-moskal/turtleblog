#!/usr/bin/env node

import * as getStdin from "get-stdin"
import * as commander from "commander"

import {turtleGenerate} from "../turtle-generate"
import {dieOnError} from "../toolbox/die-on-error"

dieOnError()

commander
	.option("-b, --blog-dir [dir]", "name of the output blog directory", "blog")
	.parse(process.argv)

; (async() => {
	const {blogDir} = commander
	const stdin = await getStdin()
	const websiteData = JSON.parse(stdin)
	const websiteOutput = await turtleGenerate({blogDir, websiteData})
	const websiteOutputString = JSON.stringify(websiteOutput)
	process.stdout.write(websiteOutputString)
})()
