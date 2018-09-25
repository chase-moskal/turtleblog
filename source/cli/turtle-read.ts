#!/usr/bin/env node

import * as commander from "commander"

import {turtleRead} from "../turtle-read"
import {dieOnError} from "../util/die-on-error"

dieOnError()

commander
	.option("-s, --source [dir]", "website source code directory", "source")
	.parse(process.argv)

; (async() => {
	const source = commander.source
	const website = await turtleRead({source})
	const output = JSON.stringify(website)
	process.stdout.write(output)
})()
