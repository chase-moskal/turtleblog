
import {turtleRead} from "./turtle-read"
import {turtleGenerate} from "./turtle-generate"

describe("turtle-generate", () => {
	const source = "source-demo"
	const blog = "blog"
	const home = "home"
	const websiteMetadataPromise = turtleRead({source, blog, home})

	it("returns website output", async() => {
		const websiteMetadata = await websiteMetadataPromise
		const websiteOutput = await turtleGenerate({websiteMetadata})

		expect(websiteOutput).toHaveProperty("pages")
		expect(websiteOutput.pages.length).toBeGreaterThanOrEqual(3)

		const homePage = websiteOutput.pages.find(
			page => page.id === websiteMetadata.homeId
		)

		expect(homePage.content).toMatch(/\<h1\>/ig)
	})
})
