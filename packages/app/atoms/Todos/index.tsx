import { useMemoizedFn } from 'ahooks'
import { observer } from 'mobx-react-lite'
import { useLayoutEffect, useState } from 'react'
import { container } from 'tsyringe'

import styles from './index.css'
import Item from './Item'
import Model from './model'

interface IProps {
	ids: Array<string>
}

const Index = (props: IProps) => {
	const { ids } = props
	const [x] = useState(() => container.resolve(Model))
	const items = $copy(x.items)

	useLayoutEffect(() => {
		x.init(ids)

		return () => x.off()
	}, [ids])

	if (!ids.length) return <div className={$cx('w_100 pt_6 pb_6', styles.empty)}>未添加待办</div>

	const updateTodoItem = useMemoizedFn(x.updateTodoItem)
	const check = useMemoizedFn(x.check)

	return (
		<div className={$cx('w_100 flex flex_column', styles._local)}>
			{items.map((item, index) => (
				<Item
					item={item}
					index={index}
					updateTodoItem={updateTodoItem}
					check={check}
					key={item.id}
				></Item>
			))}
		</div>
	)
}

export default new $app.handle(Index).by(observer).by($app.memo).get()
