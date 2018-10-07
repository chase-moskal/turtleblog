#!/usr/bin/env node

import * as getStdin from "get-stdin"

import {turtleGenerate} from "../turtle-generate"
import {dieOnError} from "../toolbox/die-on-error"

dieOnError()

; (async() => {
	const stdin = await getStdin()
	const websiteMetadata = JSON.parse(stdin)
	const websiteOutput = await turtleGenerate({websiteMetadata})
	const websiteOutputString = JSON.stringify(websiteOutput)
	process.stdout.write(websiteOutputString)
})()
