import { $getNodeByKey, $isRootNode } from 'lexical'

import type { NodeMap } from 'lexical'

const Index = (key: string, node_map: NodeMap) => {
	const node = node_map.get(key)
	const parent = $getNodeByKey(node.__parent)

	if (parent) {
		if ($isRootNode(parent)) return key

		return parent.getTopLevelElement().getKey()
	} else {
		return Index(node.__parent, node_map)
	}
}

export default Index
