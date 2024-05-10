import { $createToggleNode } from './index'

export default (dom: HTMLDetailsElement) => {
	const node = $createToggleNode({ open: dom.open ?? true })

	return { node }
}
