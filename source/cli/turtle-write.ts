#!/usr/bin/env node

import * as getStdin from "get-stdin"
import * as commander from "commander"

import {turtleWrite} from "../turtle-write"
import {dieOnError} from "../toolbox/die-on-error"

dieOnError()

commander
	.option("-d, --dist-dir [dir]", "website destination directory", "dist")
	.parse(process.argv)

; (async() => {
	const {distDir} = commander
	const stdin = await getStdin()
	const websiteOutput = JSON.parse(stdin)
	await turtleWrite({websiteOutput, distDir})
})()
