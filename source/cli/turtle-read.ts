#!/usr/bin/env node

import * as commander from "commander"
import {turtleRead} from "../turtle-read"
import {dieOnError} from "../toolbox/die-on-error"

dieOnError()

commander
	.option("-s, --source [dir]", "website source code directory", "source")
	.option("-b, --blog [dir]", "name of the blog directory", "blog")
	.parse(process.argv)

; (async() => {
	const {source, blog} = commander
	const websiteMetadata = await turtleRead({source, blog})
	const stdout = JSON.stringify(websiteMetadata)
	process.stdout.write(stdout)
})()
