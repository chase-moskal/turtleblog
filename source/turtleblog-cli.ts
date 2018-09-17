#!/usr/bin/env node

import * as commander from "commander"
import {dieOnError} from "./util/die-on-error"
import {turtleBuildBlog} from "./turtle-build-blog"

dieOnError()

commander
	.command("turtleblog --source <source> --dist <dist>")
	.option("-s, --source")
	.option("-d, --dist")
	.parse(process.argv)

turtleBuildBlog({
	source: commander.source,
	dist: commander.dist
})
