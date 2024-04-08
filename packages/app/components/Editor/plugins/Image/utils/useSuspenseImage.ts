const cache = new Set()

export default (src: string) => {
	if (!cache.has(src)) {
		throw new Promise(resolve => {
			const img = new Image()

			img.src = src

			img.onload = () => {
				cache.add(src)

				resolve(null)
			}
		})
	}
}
