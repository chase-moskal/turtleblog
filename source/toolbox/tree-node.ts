
import {arrayFlatten} from "./array-flatten"

type Unpacked<T> =
	T extends (infer U)[]
		? U
		: T extends (...args: any[]) => infer U
			? U
			: T extends Promise<infer U>
				? U
				: T

export const TreeRootNoValue = Symbol()

export class TreeNode<T> {
	readonly value: T
	readonly root: boolean
	readonly children: TreeNode<T>[] = []

	constructor(value: T, root: boolean = false) {
		this.value = value
		this.root = root
	}

	addChildValue(value: T) {
		const child = new TreeNode(value)
		this.children.push(child)
	}

	addChildNode(node: TreeNode<T>) {
		this.children.push(node)
	}

	map<T2>(callback: (value: T) => T2): TreeNode<T2> {
		const newTree = this.root
			? new TreeNode<T2>(undefined, this.root)
			: new TreeNode<T2>(callback(this.value), this.root)
		const children = this.children.map(child => child.map(callback))
		for (const child of children) newTree.addChildNode(child)
		return newTree
	}

	filter(callback: (value: T) => boolean): TreeNode<T> {
		const newTree = new TreeNode<T>(this.value, this.root)
		const filteredChildren = this.children
			.filter(child => callback(<T>child.value))
			.map(child => child.filter(callback))
		for (const child of filteredChildren) newTree.addChildNode(child)
		return newTree
	}

	toArray(): T[] {
		const children = arrayFlatten<T>(this.children.map(child => child.toArray()))
		return this.root
			? children
			: [this.value, ...children]
	}

	async promiseAll<X>(): Promise<TreeNode<X>> {
		if (this.root) {
			const newChildren = await Promise.all(
				this.children.map(child => child.promiseAll<X>())
			)
			const newTree = new TreeNode<X>(undefined, this.root)
			for (const newChild of newChildren) newTree.addChildNode(newChild)
			return newTree
		}
		else {
			const [newValue, newChildren] = await Promise.all([
				this.value,
				Promise.all(this.children.map(child => child.promiseAll<X>()))
			])
			const newTree = new TreeNode<X>(<any>newValue, this.root)
			for (const newChild of newChildren) newTree.addChildNode(newChild)
			return newTree
		}
	}
}
