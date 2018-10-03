
export function arrayFlatten<Type>(array: any[]): Type[] {
	return array.reduce(
		(arr, value) => Array.isArray(value)
			? arr.concat(arrayFlatten(value))
			: arr.concat(value), []
	)
}
