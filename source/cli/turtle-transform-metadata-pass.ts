#!/usr/bin/env node

import * as getStdin from "get-stdin"
import {dieOnError} from "../toolbox/die-on-error"
import {turtleTransformMetadataPass} from "../turtle-transform-metadata-pass"

dieOnError()

; (async() => {
	const stdin = await getStdin()
	const metadataIn = JSON.parse(stdin)
	const metadataOut = await turtleTransformMetadataPass({websiteMetadata: metadataIn})
	const output = JSON.stringify(metadataOut)
	process.stdout.write(output)
})()
