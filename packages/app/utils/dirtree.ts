import { omit } from 'lodash-es'

import type { Doc, App } from '@/types'

export const omitDirTree = (
	module: App.ModuleType,
	doc: Doc.Content,
	emit: ((key: any, value: {} | Doc.Content) => void) | undefined
) => {
	if (doc._id !== module || !emit) return

	doc.data.forEach((item) => {
		if (item.type === 'dir') {
			if (item.children.length) {
			}

			emit(undefined, omit(item, 'data'))
		} else {
			emit(undefined, omit(item, 'data'))
		}
	})
}
