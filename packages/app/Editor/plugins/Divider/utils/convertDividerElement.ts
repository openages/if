import { $createDividerNode } from './index'

import type { DOMConversionOutput } from 'lexical'

export default (): DOMConversionOutput | null => {
	const node = $createDividerNode()

	return { node }
}
