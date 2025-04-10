import { useEventListener, useMemoizedFn } from 'ahooks'
import { debounce } from 'lodash-es'
import { useEffect, useRef, useState } from 'react'

interface HookArgs {
	value: string
	max_length?: number
	update: (textContent: string) => Promise<any> | void
}

export default (args: HookArgs) => {
	const { value, update } = args
	const input = useRef<HTMLDivElement>(null)
	const [compositing, setCompositing] = useState(false)
	const max_length = args.max_length || 6000

	useEffect(() => {
		const el = input.current

		if (!el) return
		if (el.textContent === value) return

		el.textContent = value
	}, [value])

	const updateValue = useMemoizedFn(async (textContent: string) => {
		if (textContent?.length > max_length) {
			textContent = textContent.slice(0, max_length)

			input.current!.textContent = textContent

			input.current!.blur()

			update(textContent)

			return textContent
		} else {
			update(textContent)

			return textContent
		}
	})

	useEventListener('compositionstart', () => setCompositing(true), { target: input })

	useEventListener(
		'compositionend',
		() => {
			setCompositing(false)

			updateValue(input.current!.textContent!)
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

	return { input, onInput, updateValue }
}
