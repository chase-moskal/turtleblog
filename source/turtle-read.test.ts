
import {turtleRead} from "./turtle-read"

describe("turtle-read", () => {
	const source = "source-demo"
	const blog = "blog"
	const home = "home"

	it("returns website metadata", async() => {
		const websiteMetadata = await turtleRead({source, blog, home})

		expect(websiteMetadata).toHaveProperty("source")
		expect(websiteMetadata).toHaveProperty("blog")
		expect(websiteMetadata).toHaveProperty("pages")
		expect(websiteMetadata).toHaveProperty("articles")
		expect(websiteMetadata).toHaveProperty("blogPosts")
		expect(websiteMetadata).toHaveProperty("blogIndex")
		expect(websiteMetadata).toHaveProperty("navigation")

		const homePage = websiteMetadata.pages.find(
			page => /^home$/i.test(page.name)
		)

		expect(homePage.sections).toHaveLength(1)
	})
})
