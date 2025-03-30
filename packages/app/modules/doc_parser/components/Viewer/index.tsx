import { useMemoizedFn } from 'ahooks'
import { Tabs } from 'antd'
import { useMemo } from 'react'

import styles from './index.css'
import Item from './Item'

import type { IPropsViewer, IPropsViewerItem } from '../../types'

const Index = (props: IPropsViewer) => {
	const { mds, onChangeMd, onRemove } = props

	const props_viewer_item: Omit<IPropsViewerItem, 'index' | 'content'> = {
		onChangeMd
	}

	const items = useMemo(() => {
		return mds.map((item, index) => ({
			key: `${index}`,
			label: item.name,
			children: <Item index={index} content={item.content} {...props_viewer_item}></Item>
		}))
	}, [mds])

	const onEdit = useMemoizedFn(key => onRemove(Number(key)))

	return (
		<div className={$cx('w_100 h_100 border_box flex justify_center', styles._local)}>
			<Tabs className='w_100' type='editable-card' hideAdd items={items} onEdit={onEdit}></Tabs>
		</div>
	)
}

export default $app.memo(Index)
