#!/usr/bin/env node

import * as commander from "commander"
import {turtleBuildBlog} from "./turtle-build-blog"

commander
	.command("turtleblog --source <source> --dist <dist>")
	.option("-s, --source")
	.option("-d, --dist")
	.parse(process.argv)

turtleBuildBlog({
	source: commander.source,
	dist: commander.dist
})
