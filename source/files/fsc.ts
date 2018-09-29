
// fs module -- cool edition

import * as fs from "fs"
import {promisify} from "util"

const readFileAsync = promisify(fs.readFile)
const writeFileAsync = promisify(fs.writeFile)

export const readFile = (path: string, encoding = "utf8") =>
	readFileAsync(path, encoding)

export const writeFile = (path: string, encoding = "utf8") =>
	writeFileAsync(path, encoding)
