export const getPercent = (v: number | string, fixed?: number) => {
	if (typeof v === 'string') v = parseFloat(v)

	return parseInt(String(parseFloat(v.toFixed(fixed || 2)) * 100))
}
