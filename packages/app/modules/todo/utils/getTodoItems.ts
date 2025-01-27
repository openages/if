import { getDocItemsData } from '@/utils'
import getEditorText from '@/utils/getEditorText'

import type { RxDocument } from 'rxdb'
import type { Todo } from '@/types'

export default (items: Array<RxDocument<Todo.Todo>>, pick?: (item: Todo.Todo) => any) => {
	return getDocItemsData(items).map(item => {
		item['text'] = getEditorText(item.text)

		if (item.children && item.children.length) {
			item.children = item.children.map(child => {
				child['text'] = getEditorText(child.text)

				return child
			})
		}

		return pick ? pick(item) : item
	})
}
