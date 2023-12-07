import { useEventListener, useMemoizedFn } from 'ahooks'
import { debounce } from 'lodash-es'
import { useEffect, useRef, useState } from 'react'

import { todo } from '@/appdata'

import { getCursorPosition, setCursorPosition } from '../utils'

import type { ClipboardEvent } from 'react'

interface HookArgs {
	value: string
	update: (textContent: string) => Promise<any> | void
}

export default (args: HookArgs) => {
	const { value, update } = args
	const input = useRef<HTMLDivElement>(null)
	const [compositing, setCompositing] = useState(false)

	useEffect(() => {
		const el = input.current

		if (!el) return
		if (value === undefined) return
		if (el.textContent === value) return

		el.textContent = value
	}, [value])

	const updateValue = useMemoizedFn(async (textContent: string) => {
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
	})

	useEventListener('compositionstart', () => setCompositing(true), { target: input })

	useEventListener(
		'compositionend',
		() => {
			setCompositing(false)

			updateValue(input.current.textContent)
		},
		{ target: input }
	)

	// useEventListener(
	// 	'paste',
	// 	async (e: ClipboardEvent<HTMLDivElement>) => {
	// 		e.preventDefault()

	// 		const text = e.clipboardData.getData('text/plain')
	// 		const start = getCursorPosition(input.current)
	// 		const selection = window.getSelection()
	// 		const select_string = selection.toString()

	// 		if (select_string) {
	// 			const range = selection.getRangeAt(0)

	// 			const before_text = input.current.textContent.slice(0, range.startOffset)
	// 			const after_text = input.current.textContent.slice(range.endOffset)

	// 			input.current.textContent = before_text + text + after_text

	// 			setCursorPosition(input.current, before_text.length + text.length)
	// 		} else {
	// 			input.current.textContent += text

	// 			setCursorPosition(input.current, start + text.length)
	// 		}

	// 		await update(input.current.textContent)
	// 	},
	// 	{ target: input }
	// )

	const onInput = useMemoizedFn(
		debounce(
			({ target: { textContent } }) => {
				if (compositing) return

				updateValue(textContent)
			},
			600,
			{ leading: false }
		)
	)

	return { input, onInput }
}
