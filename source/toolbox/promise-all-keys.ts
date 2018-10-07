
import {Unpacked} from "./interfaces"

interface ObjInput {
	[key: string]: Promise<any>
}

type UnpackedObject<T> = {
	[P in keyof T]: Unpacked<T[P]>
}

export async function promiseAllKeys<T extends ObjInput>(obj: T): Promise<UnpackedObject<T>> {
	const operations = Object.keys(obj).map(async key => [key, await obj[key]])
	const newObject = {}
	for (const [key, value] of await Promise.all(operations))
		newObject[key] = value
	return <UnpackedObject<T>>newObject
}
