import { useMemoizedFn, useEventListener } from 'ahooks'
import { debounce } from 'lodash-es'
import { useRef, useEffect } from 'react'

import { todo } from '@/appdata'

import { getCursorPosition, setCursorPosition } from '../utils'

import type { IPropsTodoItem, IPropsChildrenItem, IPropsGroupTitle } from '../types'
import type { ClipboardEvent } from 'react'

interface HookArgs {
	item: IPropsTodoItem['item'] | IPropsChildrenItem['item'] | IPropsGroupTitle['item']
	update: (textContent: string) => Promise<any>
}

export default (args: HookArgs) => {
	const { item, update } = args
	const { text } = item
	const input = useRef<HTMLDivElement>(null)

	useEffect(() => {
		const el = input.current

		if (!el) return
		if (text === undefined) return
		if (el.textContent === text) return

		el.textContent = text
	}, [text])

	useEventListener(
		'paste',
		async (e: ClipboardEvent<HTMLDivElement>) => {
			e.preventDefault()

			const text = e.clipboardData.getData('text/plain')
			const start = getCursorPosition(input.current)
			const selection = window.getSelection()
			const select_string = selection.toString()

			if (select_string) {
				const range = selection.getRangeAt(0)

				const before_text = input.current.textContent.slice(0, range.startOffset)
				const after_text = input.current.textContent.slice(range.endOffset)

				input.current.textContent = before_text + text + after_text

				setCursorPosition(input.current, before_text.length + text.length)
			} else {
				input.current.textContent += text

				setCursorPosition(input.current, start + text.length)
			}

			await update(input.current.textContent)
		},
		{ target: input }
	)

	const onInput = useMemoizedFn(
		debounce(
			async ({ target: { textContent } }) => {
				if (textContent?.length > todo.text_max_length) {
					textContent = textContent.slice(0, todo.text_max_length)

					input.current.blur()

					await update(textContent)
				} else {
					const start = getCursorPosition(input.current)

					await update(textContent)

					if (document.activeElement !== input.current) return

					setCursorPosition(input.current, start)
				}
			},
			450,
			{ leading: false }
		)
	)

	return { input, onInput }
}
