export default ['frequent', 'people', 'nature', 'foods', 'activity', 'places', 'objects', 'symbols', 'flags'].reduce(
	(total, item) => {
		total[item] = { svg: require(`@/public/icons/category_${item}.svg?raw`) }

		return total
	},
	{} as Record<string, any>
)
