import { useEventListener, useMemoizedFn } from 'ahooks'
import { debounce } from 'lodash-es'
import { useEffect, useRef, useState } from 'react'

import { todo } from '@/appdata'

import { getCursorPosition, setCursorPosition } from '../utils'

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
