import { App } from '@/types'

import { $createRefNode } from './index'

import type { DOMConversionOutput } from 'lexical'

export default (el: HTMLElement): DOMConversionOutput | null => {
	const module = el.getAttribute('lexical-ref-module') as App.ModuleType
	const id = el.getAttribute('lexical-ref-id')

	if (module && id) {
		const node = $createRefNode({ module, id })

		return { node }
	}

	return null
}
