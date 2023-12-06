import { useMemoizedFn } from 'ahooks'
import { cloneDeep } from 'lodash-es'
import { toJS } from 'mobx'
import { observer } from 'mobx-react-lite'
import { useState } from 'react'
import { container } from 'tsyringe'

import { GlobalModel } from '@/context/app'
import { DndContext } from '@dnd-kit/core'
import { SortableContext, arrayMove, rectSortingStrategy } from '@dnd-kit/sortable'

import Item from './Item'
import styles from './index.css'

import type { DragEndEvent } from '@dnd-kit/core'

const Index = () => {
	const [global] = useState(() => container.resolve(GlobalModel))
	const app_modules = toJS(global.app.app_modules)

	const changeIsFixed = useMemoizedFn((index: number, v: boolean) => {
		const _app_modules = cloneDeep(app_modules)

		_app_modules[index].fixed = v

		global.app.update(_app_modules)
	})

	const onDragEnd = useMemoizedFn(({ active, over }: DragEndEvent) => {
		if (!over?.id) return
		if (active.id === over.id) return

		global.app.update(
			arrayMove(app_modules, active.data.current.index as number, over.data.current.index as number)
		)
	})

	return (
		<div className={$cx('flex flex_wrap', styles._local)}>
			<DndContext onDragEnd={onDragEnd}>
				<SortableContext items={app_modules} strategy={rectSortingStrategy}>
					{app_modules.map((item, index) => (
						<Item key={item.id} {...{ item, index, changeIsFixed }}></Item>
					))}
				</SortableContext>
			</DndContext>
		</div>
	)
}

export default new $app.handle(Index).by(observer).by($app.memo).get()
