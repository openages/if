import { $isElementNode } from 'lexical'

import type { RegisteredNodes, InternalSerializedNode } from '@/Editor/types'

const Index = (json: InternalSerializedNode, node_map: RegisteredNodes) => {
	const node_registed = node_map.get(json.type)
	const node = node_registed.klass.importJSON(json)
	const children = json.children

	if ($isElementNode(node) && Array.isArray(children)) {
		for (let i = 0; i < children.length; i++) {
			const child_node = Index(children[i], node_map)

			node.append(child_node)
		}
	}

	return node
}

export default Index
