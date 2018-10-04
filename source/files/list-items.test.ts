
import {listItems} from "./list-items"
import {FileSystemItem} from "./interfaces"

describe("files/list-items function", () => {

	it("lists top level files and directories", async() => {

		// get top level files
		const items = await listItems("source-demo")
		expect(items).toBeDefined()
		expect(items.length).toBeGreaterThanOrEqual(5)

		// check a file
		const styleScss = items.find(item => /^style\.scss$/.test(item.path))
		expect(styleScss).toBeDefined()
		expect(styleScss.isDirectory).toBeFalsy()
		expect(styleScss.path).toBe("source-demo/style.scss")

		// check a directory
		const layoutsDir = items.find(item => /^layouts$/.test(item.path))
		expect(layoutsDir).toBeDefined()
		expect(layoutsDir.isDirectory).toBeTruthy()
		expect(layoutsDir.path).toBe("source-demo/layouts")
	})
})
