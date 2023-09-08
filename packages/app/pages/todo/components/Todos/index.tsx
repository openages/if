import { useSize } from 'ahooks'
import { useRef, useEffect } from 'react'

import TodoItem from '../TodoItem'
import styles from './index.css'

import type { IPropsTodos } from '../../types'

const Index = (props: IPropsTodos) => {
	const { items } = props
	const container = useRef<HTMLDivElement>(null)
	const canvas = useRef<HTMLCanvasElement>(null)
	const size = useSize(container)

	console.log(size)

	useEffect(() => {
		if (!size) return
		if (!canvas.current) return

		const c = canvas.current.getContext('2d')

		c.lineWidth = 1
		c.strokeStyle = 'red'

		c.beginPath()

		c.moveTo(0, 0)
		c.lineTo(0, 10)

		c.stroke()
	}, [size])

	return (
		<div className={$cx('limited_content_wrap flex flex_column relative', styles._local)} ref={container}>
			{size?.height && (
				<canvas
					className='canvas_wrap absolute left_0'
					width={49}
					height={size.height - 36 - 60}
					ref={canvas}
				></canvas>
			)}
			{items.map((item, index) => (
				<TodoItem {...item} key={index}></TodoItem>
			))}
		</div>
	)
}

export default $app.memo(Index)
