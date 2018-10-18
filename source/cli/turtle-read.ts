#!/usr/bin/env node

import * as commander from "commander"

import {turtleRead} from "../turtle-read"
import {dieOnError} from "../toolbox/die-on-error"

dieOnError()

commander
	.option("-s, --site-title [string]", "name of the website used in title", "turtleblog")
	.option("-s, --source-dir [dir]", "website source code directory", "source")
	.parse(process.argv)

; (async() => {
	const {siteTitle, sourceDir} = commander
	const websiteData = await turtleRead({siteTitle, sourceDir})
	const stdout = JSON.stringify(websiteData)
	process.stdout.write(stdout)
})()
