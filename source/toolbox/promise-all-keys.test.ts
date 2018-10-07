
import {promiseAllKeys} from "./promise-all-keys"

function delay<T>(value: T, delay = 1) {
	return new Promise<T>((resolve, reject) =>
		setTimeout(() => resolve(value), delay)
	)
}

describe("promise all keys", () => {

	it("properly waits for all object property promises", async() => {
		const input = {
			a: delay(1),
			b: delay("2"),
			c: delay(true)
		}
		const output = await promiseAllKeys(input)
		expect(output.a).toBe(1)
		expect(output.b).toBe("2")
		expect(output.c).toBe(true)
	})
})
