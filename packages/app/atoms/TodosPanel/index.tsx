import { useMemoizedFn } from 'ahooks'
import { observer } from 'mobx-react-lite'
import { useLayoutEffect, useState } from 'react'
import { container } from 'tsyringe'

import styles from './index.css'
import Item from './Item'
import Model from './model'

export interface IProps {
	file_id: string
	angle_id: string
}

const Index = (props: IProps) => {
	const { file_id, angle_id } = props
	const [x] = useState(() => container.resolve(Model))
	const items = $copy(x.items)

	useLayoutEffect(() => {
		x.init({ file_id, angle_id })

		return () => x.off()
	}, [file_id, angle_id])

	const updateTodoItem = useMemoizedFn(x.updateTodoItem)
	const changeStatus = useMemoizedFn(x.changeStatus)
	const check = useMemoizedFn(x.check)
	const remove = useMemoizedFn(x.remove)

	return (
		<div className={$cx('w_100 border_box flex flex_column', styles._local)}>
			{items.map((item, index) => (
				<Item
					item={item}
					index={index}
					updateTodoItem={updateTodoItem}
					changeStatus={changeStatus}
					check={check}
					remove={remove}
					key={item.id}
				></Item>
			))}
		</div>
	)
}

export default new $app.handle(Index).by(observer).by($app.memo).get()
