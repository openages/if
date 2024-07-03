export default <T>(list: Array<T>, callback: (arg0: T) => string): Readonly<Record<string, Array<T>>> => {
	const index: Record<string, Array<T>> = {}

	for (const item of list) {
		const key = callback(item)

		if (index[key]) {
			index[key].push(item)
		} else {
			index[key] = [item]
		}
	}

	return index
}
