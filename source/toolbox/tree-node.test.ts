
import {TreeNode} from "./tree-node"

interface A {
	b: string
}

function populateTree(node: TreeNode<A>) {
	node.addChildValue({b: "2"})
	node.addChildValue({b: "3"})
	node.children[1].addChildValue({b: "4"})
	node.children[1].addChildValue({b: "5"})
}

const prepareExampleNode = () => {
	const node = new TreeNode<A>({b: "1"})
	populateTree(node)
	return node
}

const prepareExampleContainer = () => {
	const node = new TreeNode<A>(undefined, true)
	populateTree(node)
	return node
}

describe("tree node", () => {

	describe("constructor", () => {
		it("can prepare an example tree", async() => {
			const tree = prepareExampleNode()
			expect(tree.value).toBeDefined()
			expect(tree.value.b).toBe("1")
			expect(tree.children).toHaveLength(2)
		})
	})

	describe("toArray", () => {

		it("lists values in flattended array", async() => {
			const tree = prepareExampleNode()
			const values = tree.toArray()
			expect(values).toHaveLength(5)
		})

		it("lists values except for container value", async() => {
			const tree = prepareExampleContainer()
			const values = tree.toArray()
			expect(values).toHaveLength(4)
		})
	})

	describe("map", () => {
		interface C {
			d: string
		}

		it("transforms all tree values", async() => {
			const tree = prepareExampleNode()
			const newTree = tree.map<C>(({b}) => ({d: b}))
			expect(newTree.value.d).toBe("1")
			expect(newTree.children[0].value.d).toBe("2")
		})

		it("transforms tree values except for container value", async() => {
			const tree = prepareExampleContainer()
			const newTree = tree.map<C>(({b}) => ({d: b}))
			expect(newTree.value).toBeUndefined()
			expect(newTree.children[0].value.d).toBe("2")
		})
	})

	describe("filter", () => {

		it("filter operation can remove children", async() => {
			const tree = prepareExampleNode()

			// filter child
			const result = tree.filter(a => a.b !== "2")
			expect(result.children).toHaveLength(1)

			// filter sub child
			const result2 = tree.filter(a => a.b !== "4")
			expect(result2.children[1].children).toHaveLength(1)
		})

		it("filter operation removes children correctly", async() => {
			const tree = new TreeNode(undefined, true)
			tree.addChildValue("1")
			tree.children[0].addChildValue("2")

			const result = tree.filter(x => !!x)
			expect(result.toArray()).toHaveLength(2)
		})
	})

	describe("promiseAll", () => {
		function delayValue<X>(value: X, delay = 1): Promise<X> {
			return new Promise(
				(resolve, reject) => setTimeout(() => resolve(value), delay)
			)
		}

		it("converts a tree of promises into a promised tree", async() => {
			const tree = prepareExampleNode()
			const treeOfPromises = tree.map<Promise<A>>(value => delayValue(value))
			const promisedTree = treeOfPromises.promiseAll()
			const finalTree = await promisedTree
			expect(finalTree.value.b).toBe("1")
			expect(finalTree.children[0].value.b).toBe("2")
		})

		it("converts tree of promises, ignoring container value", async() => {
			const tree = prepareExampleContainer()
			const treeOfPromises = tree.map<Promise<A>>(value => delayValue(value))
			const promisedTree = treeOfPromises.promiseAll()
			const finalTree = await promisedTree
			expect(finalTree.value).toBeUndefined()
			expect(finalTree.children[0].value.b).toBe("2")
		})
	})
})
