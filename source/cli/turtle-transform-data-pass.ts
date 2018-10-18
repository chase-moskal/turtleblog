#!/usr/bin/env node

import * as getStdin from "get-stdin"
import {dieOnError} from "../toolbox/die-on-error"
import {turtleTransformDataPass} from "../transforms/turtle-transform-data-pass"

dieOnError()

; (async() => {
	const stdin = await getStdin()
	const dataIn = JSON.parse(stdin)
	const dataOut = await turtleTransformDataPass({websiteData: dataIn})
	const output = JSON.stringify(dataOut)
	process.stdout.write(output)
})()
