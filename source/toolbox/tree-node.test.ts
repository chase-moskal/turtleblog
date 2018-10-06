
import {TreeNode} from "./tree-node"

interface A {
	b: string
}

const prepareExampleNode = () => {
	const node = new TreeNode<A>({b: "1"})
	node.addChildValue({b: "2"})
	node.addChildValue({b: "3"})
	node.children[1].addChildValue({b: "4"})
	node.children[1].addChildValue({b: "5"})
	return node
}

describe("tree node", () => {

	it("accepts a value and children", () => {
		const node = prepareExampleNode()

		expect(node.value).toBeDefined()
		expect(node.value.b).toBe("1")

		expect(node.children).toHaveLength(2)
	})

	it("filter operation can remove children", () => {
		const node = prepareExampleNode()

		// filter child
		const result = node.filter(a => a.b !== "2")
		expect(result.children).toHaveLength(1)

		// filter sub child
		const result2 = node.filter(a => a.b !== "4")
		expect(result2.children[1].children).toHaveLength(1)
	})
})
