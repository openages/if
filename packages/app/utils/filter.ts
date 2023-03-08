export const getComputedStyleValue = (el: Element, property: string) => {
	return Number(getComputedStyle(el).getPropertyValue(property).replace('px', ''))
}
