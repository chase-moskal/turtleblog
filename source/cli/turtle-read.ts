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
	const websiteMetadata = await turtleRead({siteTitle, sourceDir})
	const stdout = JSON.stringify(websiteMetadata)
	process.stdout.write(stdout)
})()
