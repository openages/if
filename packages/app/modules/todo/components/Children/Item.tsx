import { useMemoizedFn } from 'ahooks'
import { sanitize } from 'dompurify'
import { debounce } from 'lodash-es'
import { useRef, useEffect } from 'react'
import { Switch, Case } from 'react-if'

import { todo } from '@/appdata'
import { Square, CheckSquare } from '@phosphor-icons/react'

import { getCursorPosition, setCursorPosition } from '../../utils'
import styles from './index.css'

import type { IPropsChildrenItem } from '../../types'

const Index = (props: IPropsChildrenItem) => {
	const { item, index, children_index, insert, update, tab } = props
	const { id, text, status } = item
	const input = useRef<HTMLDivElement>(null)

	useEffect(() => {
		const el = input.current

		if (el.innerText === '') el.focus()
	}, [])

	useEffect(() => {
		const el = input.current

		if (el.innerText === text) return

		el.innerText = text
	}, [text])

	const onInput = useMemoizedFn(
		debounce(
			async ({ target: { innerText } }) => {
				if (innerText?.length > todo.child_max_length) {
					innerText = sanitize(innerText.slice(0, todo.child_max_length))

					input.current.blur()

					input.current.innerText = innerText

					await update(children_index, { text: innerText })
				} else {
					const filter_text = sanitize(innerText)

					if (innerText !== filter_text) {
						input.current.blur()

						input.current.innerText = filter_text

						await update(children_index, { text: filter_text })
					} else {
						const start = getCursorPosition(input.current)

						await update(children_index, { text: filter_text })

						if (document.activeElement !== input.current) return

						setCursorPosition(input.current, start)
					}
				}
			},
			450,
			{ leading: false }
		)
	)

	const onCheck = useMemoizedFn(() => {
		update(children_index, { status: status === 'unchecked' ? 'checked' : 'unchecked' })
	})

	const onKeyDown = useMemoizedFn((e) => {
		if (e.key === 'Enter') {
			e.preventDefault()

			insert(children_index)
		}

		if (e.key === 'Tab') {
			tab({ type: 'out', index, children_index })
		}
	})

	return (
		<div
			className={$cx(
				'todo_child_item w_100 flex align_start relative',
				item.status === 'checked' && styles.checked
			)}
		>
			<div
				className='action_wrap flex justify_center align_center cursor_point clickable'
				onClick={onCheck}
			>
				<Switch>
					<Case condition={status === 'unchecked'}>
						<Square size={14} />
					</Case>
					<Case condition={status === 'checked'}>
						<CheckSquare size={14} />
					</Case>
				</Switch>
			</div>
			<div className='text_wrap' ref={input} contentEditable onInput={onInput} onKeyDown={onKeyDown}></div>
		</div>
	)
}

export default $app.memo(Index)
