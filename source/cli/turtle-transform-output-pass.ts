#!/usr/bin/env node

import * as getStdin from "get-stdin"
import {dieOnError} from "../toolbox/die-on-error"
import {turtleTransformOutputPass} from "../turtle-transform-output-pass"

dieOnError()

; (async() => {
	const stdin = await getStdin()
	const outputIn = JSON.parse(stdin)
	const outputOut = await turtleTransformOutputPass({websiteOutput: outputIn})
	const output = JSON.stringify(outputOut)
	process.stdout.write(output)
})()
