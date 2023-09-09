import { useDrag, useDrop } from 'ahooks'
import { theme } from 'antd'
import Color from 'color'
import { Line } from 'konva/lib/shapes/Line'
import { useState, useRef, useEffect } from 'react'
import { Else, If, Then } from 'react-if'

import { points } from '@/utils'
import { CheckSquare, Square } from '@phosphor-icons/react'

import styles from './index.css'
import { getRelativePostion } from './utils'

import type { IPropsTodoItem } from '../../types'

const { useToken } = theme

const Index = (props: IPropsTodoItem) => {
	const { layer, container, id, type, text } = props
	const linker = useRef<HTMLDivElement>(null)
	const [link_id, setLinkId] = useState('')
	const [link_positions, setLinkPositions] = useState({ start: 0, end: 0 })
	const { token } = useToken()

	useDrag(id, linker, {
		onDragStart: ({ target }) => {
			setLinkId((target as HTMLDivElement).getAttribute('data-id'))
		},
		onDragEnd: () => {
			setLinkId('')
		}
	})

	useDrop(linker, {
		onDom: (active_id: string, { target }) => {
			const active = document.getElementById(active_id) as HTMLDivElement
			const over = target as HTMLDivElement

			if (active_id === over.getAttribute('data-id')) return

			setLinkPositions({
				start: getRelativePostion(container.current, active) + 7,
				end: getRelativePostion(container.current, over) + 7
			})
		}
	})

	useEffect(() => {
		if (!layer) return
		if (!link_positions.start || !link_positions.end) return

		const line = new Line({
			points: points(
				[15, link_positions.start],
				[1, link_positions.start + (link_positions.end - link_positions.start) / 2],
				[15, link_positions.end]
			),
			stroke: `rgba(${getComputedStyle(document.body).getPropertyValue('--color_text_rgb')},0.48)`,
			strokeWidth: 0.6,
			tension: 0.12
		})

		layer.add(line)
	}, [layer, link_positions])

	if (type === 'group') {
		return (
			<div className={$cx('flex flex_column', styles.group_wrap)}>
				<span className='group_title'>{text}</span>
			</div>
		)
	}

	return (
		<div
			className={$cx(
				'w_100 border_box flex align_start transition_normal relative',
				styles.todo_item,
				styles[props.status]
			)}
		>
			<div
				id={id}
				className={$cx(
					'dot_wrap border_box flex justify_center align_center absolute transition_normal cursor_point z_index_10',
					link_id && 'linking'
				)}
				ref={linker}
				data-id={id}
				onDragOver={(e) => {
					// console.log(e)
				}}
			></div>
			<div className='action_wrap flex justify_center align_center cursor_point clickable'>
				<If condition={props.status === 'unchecked'}>
					<Then>
						<Square size={16} />
					</Then>
					<Else>
						<CheckSquare size={16} />
					</Else>
				</If>
			</div>
			<span className='text'>{text}</span>
		</div>
	)
}

export default $app.memo(Index)
