#!/usr/bin/env node

import * as commander from "commander"
import {dieOnError} from "./util/die-on-error"
import {turtleBuildBlog} from "./turtle-build-blog"

dieOnError()

commander
	.command("turtleblog [--source <source>] [--dist <dist>] [--blog <blog>]")
	.option("-s, --source", "website source code directory", null, "source")
	.option("-d, --dist", "build output directory", null, "dist")
	.option("-b, --blog", "name of the blog", null, "blog")
	.parse(process.argv)

turtleBuildBlog({
	source: commander.source,
	dist: commander.dist,
	blog: commander.blog
})
