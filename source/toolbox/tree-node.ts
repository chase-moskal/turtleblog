
export class TreeNode<T> {
	readonly value: T
	readonly children: TreeNode<T>[] = []

	constructor(value: T) {
		this.value = value
	}

	addChild(child: TreeNode<T>) {
		this.children.push(child)
	}

	map<T2>(callback: (value: T) => T2): TreeNode<T2> {
		const newTree = new TreeNode<T2>(callback(this.value))
		const children = this.children.map(oldTree => oldTree.map(callback))
		for (const child of children) newTree.addChild(child)
		return newTree
	}
}
