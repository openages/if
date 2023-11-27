import { useMemoizedFn, useEventListener } from 'ahooks'
import { debounce } from 'lodash-es'
import { useRef, useEffect } from 'react'

import { todo } from '@/appdata'

import { getCursorPosition, setCursorPosition } from '../utils'

import type { IPropsTodoItem, IPropsChildrenItem } from '../types'
import type { ClipboardEvent } from 'react'

interface HookArgs {
	item: IPropsTodoItem['item'] | IPropsChildrenItem['item']
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

			const data = e.clipboardData.getData('text/plain')

			input.current.textContent += data
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
