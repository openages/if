import { $createNavigationNode } from './index'

export default (dom: HTMLDivElement) => {
	if (!dom.getAttribute('lexical-navigation')) return null

	return { node: $createNavigationNode() }
}
