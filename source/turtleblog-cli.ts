#!/usr/bin/env node

import * as commander from "commander"
import {dieOnError} from "./util/die-on-error"
import {turtleBuildBlog} from "./turtle-build-blog"

dieOnError()

commander
	.option("-s, --source [dir]", "website source code directory", "source")
	.option("-d, --dist [dir]", "build output directory", "dist")
	.option("-b, --blog [name]", "name of the blog", "blog")
	.parse(process.argv)

const options = {
	source: commander.source,
	dist: commander.dist,
	blog: commander.blog
}

turtleBuildBlog(options)
