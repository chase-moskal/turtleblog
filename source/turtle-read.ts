
import * as uuid from "uuid/v4"
import {TurtleReader} from "./interfaces"

export const turtleRead: TurtleReader = async({source}) => {

	return {
		navigation: [
			{
				pageId: "abc123"
			},
			{
				pageId: "bcd234"
			}
		],
		blogPosts: [
			{
				pageId: "cde345",
				date: "2018/09/24"
			}
		],
		pages: [
			{
				id: "abc123",
				name: "home",
				title: "home",
				link: "/",
				path: "home/index.html",
				sections: [
					{
						name: "welcome",
						title: "welcome",
						content: "<h1>Welcome</h1>"
					}
				]
			},
			{
				id: "bcd234",
				name: "blog",
				title: "blog",
				link: "/blog/",
				path: "blog/index.html",
				sections: [
					{
						name: "blog-index",
						title: "blog listing",
						content: "<h1>Blog listing</h1>"
					}
				]
			},
			{
				id: "cde345",
				name: "cool-update",
				title: "cool update",
				link: "/blog/2018/09/24/cool-update/",
				path: "blog/index.html",
				sections: [
					{
						name: "blog-index",
						title: "blog listing",
						content: "<h1>Blog listing</h1>"
					}
				]
			}
		]
	}
}
