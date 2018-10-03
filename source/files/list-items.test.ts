
import {listItems} from "./list-items"
import {DirectoryItem} from "./interfaces"

describe("files/list-items function", () => {

	it("lists top level files and directories", async() => {

		// get top level files
		const items = await listItems("source-demo")
		expect(items).toBeDefined()
		expect(items.length).toBeGreaterThanOrEqual(5)

		// check a file
		const styleScss = items.find(item => /^style\.scss$/.test(item.name))
		expect(styleScss).toBeDefined()
		expect(styleScss.isDirectory).toBeFalsy()
		expect(styleScss.path).toBe("style.scss")

		// check a directory
		const layoutsDir = items.find(item => /^layouts$/.test(item.name))
		expect(layoutsDir).toBeDefined()
		expect(layoutsDir.isDirectory).toBeTruthy()
		expect(layoutsDir.path).toBe("layouts")
	})

	it("returns stuff recursively with correct paths", async() => {

		// recursively get deep list
		const items = await listItems("source-demo", true)
		expect(items).toBeDefined()
		expect(items.length).toBeGreaterThanOrEqual(10)

		// check dir one level deep
		const aboutDir = items.find(item => item.name === "about")
		expect(aboutDir).toBeDefined()
		expect(aboutDir.isDirectory).toBe(true)
		expect(aboutDir.path).toBe("pages/about")

		// check dir two levels deep
		const subpageDir = items.find(item => item.name === "subpage")
		expect(subpageDir).toBeDefined()
		expect(subpageDir.isDirectory).toBe(true)
		expect(subpageDir.path).toBe("pages/coolarea/subpage")

		// check file three levels deep
		const subpageMd = items.find(item => item.name === "subpage.md")
		expect(subpageMd).toBeDefined()
		expect(subpageMd.isDirectory).toBe(false)
		expect(subpageMd.path).toBe("pages/coolarea/subpage/subpage.md")
	})
})
