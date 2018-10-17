#!/usr/bin/env node

import * as getStdin from "get-stdin"
import {dieOnError} from "../toolbox/die-on-error"
import {turtleTransformDataPass} from "../transforms/turtle-transform-data-pass"

dieOnError()

; (async() => {
	const stdin = await getStdin()
	const metadataIn = JSON.parse(stdin)
	const metadataOut = await turtleTransformDataPass({websiteData: metadataIn})
	const output = JSON.stringify(metadataOut)
	process.stdout.write(output)
})()
