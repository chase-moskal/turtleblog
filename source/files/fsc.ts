
// fs module -- cool edition

import * as fs from "fs"
import {promisify} from "util"

const copyFileAsync = promisify(fs.copyFile)
const readFileAsync = promisify(fs.readFile)
const writeFileAsync = promisify(fs.writeFile)

export const readFile = async(path: string, encoding = "utf8") =>
	readFileAsync(path, encoding)

export const writeFile = async(path: string, data: string, encoding = "utf8") =>
	writeFileAsync(path, data, encoding)

export const copyFile = async(src: string, dst: string, flags?: number) =>
	copyFileAsync(src, dst, flags)
