type Item = {
	id: string
	children?: Array<any>
}

const Index = <T>(items: Array<T & Item>, id: string): T | undefined => {
	for (let index = 0; index < items.length; index++) {
		const item = items[index]

		if (item.id === id) {
			return item as T
		} else {
			if (item.children) return Index(item.children, id)
		}
	}

	return undefined
}

export default Index
