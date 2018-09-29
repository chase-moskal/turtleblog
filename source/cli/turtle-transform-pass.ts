#!/usr/bin/env node

import * as getStdin from "get-stdin"

import {dieOnError} from "../toolbox/die-on-error"
import {turtleTransformPass} from "../turtle-transform-pass"

dieOnError()

; (async() => {
	const stdin = await getStdin()
	const website = JSON.parse(stdin)
	const outputWebsite = await turtleTransformPass({website})
	const output = JSON.stringify(outputWebsite)
	process.stdout.write(output)
})()
