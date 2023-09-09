import { useSize } from 'ahooks'
import { useRef, useMemo, useState, useEffect } from 'react'
import { Stage, Layer } from 'react-konva'

import TodoItem from '../TodoItem'
import styles from './index.css'

import type { IPropsTodos } from '../../types'
import type { Layer as ILayer } from 'konva/lib/Layer'

const Index = (props: IPropsTodos) => {
	const { items } = props
	const container = useRef<HTMLDivElement>(null)
	const [layer, setLayer] = useState<ILayer>(null)
	const size = useSize(container)
	const height = useMemo(() => (size ? size.height : 0), [size])

	return (
		<div className={$cx('limited_content_wrap relative', styles._local)}>
			{height > 0 && (
				<Stage className='stage_wrap absolute' width={16} height={height}>
					<Layer ref={(v) => setLayer(v)}></Layer>
				</Stage>
			)}
			<div className='todo_items_wrap w_100 flex flex_column' ref={container}>
				{items.map((item, index) => (
					<TodoItem {...{ container, layer }} {...item} key={index}></TodoItem>
				))}
			</div>
		</div>
	)
}

export default $app.memo(Index)
