import { useMemoizedFn } from 'ahooks'
import { debounce } from 'lodash-es'
import { useRef, useEffect } from 'react'

import { todo } from '@/appdata'
import { purify } from '@/utils'

import { getCursorPosition, setCursorPosition } from '../../../utils'

import type { IPropsTodoItem } from '../../../types'

interface HookArgs {
	item: IPropsTodoItem['item']
	index: IPropsTodoItem['index']
	update: IPropsTodoItem['update']
}

export default (args: HookArgs) => {
	const { item, index, update } = args
	const { text } = item
	const input = useRef<HTMLDivElement>(null)

	useEffect(() => {
		const el = input.current

		if (el.innerHTML === text) return

		el.innerHTML = purify(text)
	}, [text])

	const onInput = useMemoizedFn(
		debounce(
			async ({ target: { innerHTML } }) => {
				if (innerHTML?.length > todo.text_max_length) {
					innerHTML = purify(innerHTML).slice(0, todo.text_max_length)

					input.current.blur()

					input.current.innerHTML = innerHTML

					await update({ type: 'parent', index, value: { text: innerHTML } })
				} else {
					const filter_text = purify(innerHTML)

					if (innerHTML !== filter_text) {
						input.current.blur()

						input.current.innerHTML = filter_text

						await update({ type: 'parent', index, value: { text: filter_text } })
					} else {
						const start = getCursorPosition(input.current)

						await update({ type: 'parent', index, value: { text: filter_text } })

						if (document.activeElement !== input.current) return

						setCursorPosition(input.current, start)
					}
				}
			},
			450,
			{ leading: false }
		)
	)

	return { input, onInput }
}
