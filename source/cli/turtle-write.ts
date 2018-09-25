#!/usr/bin/env node

import * as getStdin from "get-stdin"
import * as commander from "commander"

import {turtleWrite} from "../turtle-write"
import {dieOnError} from "../util/die-on-error"

dieOnError()

commander
	.option("-d, --dist [dir]", "website destination directory", "dist")
	.parse(process.argv)

; (async() => {
	const stdin = await getStdin()
	const website = JSON.parse(stdin)
	const dist = commander.dist
	await turtleWrite({website, dist})
})()
