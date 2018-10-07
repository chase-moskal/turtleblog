
import {Unpacked} from "./interfaces"
import {arrayFlatten} from "./array-flatten"

export class TreeNode<T> {
	readonly value: T
	readonly container: boolean
	readonly children: TreeNode<T>[] = []

	constructor(value: T, container: boolean = false) {
		this.value = value
		this.container = container
	}

	addChildValue(value: T) {
		const child = new TreeNode(value)
		this.children.push(child)
	}

	addChildNode(node: TreeNode<T>) {
		this.children.push(node)
	}

	toArray(): T[] {
		const children = arrayFlatten<T>(this.children.map(child => child.toArray()))
		return this.container
			? children
			: [this.value, ...children]
	}

	map<T2>(callback: (value: T) => T2): TreeNode<T2> {
		const newTree = this.container
			? new TreeNode<T2>(undefined, this.container)
			: new TreeNode<T2>(callback(this.value), this.container)
		const children = this.children.map(child => child.map(callback))
		for (const child of children) newTree.addChildNode(child)
		return newTree
	}

	filter(callback: (value: T) => boolean): TreeNode<T> {
		const newTree = new TreeNode<T>(this.value, this.container)
		const filteredChildren = this.children
			.filter(child => callback(<T>child.value))
			.map(child => child.filter(callback))
		for (const child of filteredChildren) newTree.addChildNode(child)
		return newTree
	}

	async promiseAll(): Promise<TreeNode<Unpacked<T>>> {
		if (this.container) {
			const newChildren = await Promise.all(
				this.children.map(child => child.promiseAll())
			)
			const newTree = new TreeNode(undefined, this.container)
			for (const newChild of newChildren) newTree.addChildNode(newChild)
			return newTree
		}
		else {
			const [newValue, newChildren] = await Promise.all([
				this.value,
				Promise.all(this.children.map(child => child.promiseAll()))
			])
			const newTree = new TreeNode<Unpacked<T>>(<any>newValue, this.container)
			for (const newChild of newChildren) newTree.addChildNode(newChild)
			return newTree
		}
	}
}
