#!/usr/bin/env node

import * as commander from "commander"
import {turtleRead} from "../turtle-read"
import {dieOnError} from "../toolbox/die-on-error"

dieOnError()

commander
	.option("-s, --source [dir]", "website source code directory", "source")
	.parse(process.argv)

; (async() => {
	const source = commander.source
	const websiteMetadata = await turtleRead({source})
	const stdout = JSON.stringify(websiteMetadata)
	process.stdout.write(stdout)
})()
