#!/usr/bin/env node

import * as commander from "commander"

import {turtleRead} from "../turtle-read"
import {dieOnError} from "../toolbox/die-on-error"

dieOnError()

commander
	.option("-s, --source [dir]", "website source code directory", "source")
	.parse(process.argv)
	// .option("-b, --blog [dir]", "name of the blog directory", "blog")
	// .option("-h, --home [dir]", "name of the homepage", "home")

; (async() => {
	const {source} = commander
	const websiteMetadata = await turtleRead({source})
	const stdout = JSON.stringify(websiteMetadata)
	process.stdout.write(stdout)
})()
