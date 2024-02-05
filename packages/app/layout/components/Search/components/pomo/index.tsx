import { useHover, useMemoizedFn } from 'ahooks'
import { useEffect, useRef } from 'react'

import { ArrowBendDownLeft } from '@phosphor-icons/react'

import type { App, DirTree, Pomo } from '@/types'
import type { IPropsSearch } from '@/layout/types'

interface IProps extends Pick<IPropsSearch, 'changeSearchIndex'> {
	module: App.ModuleType
	item: Pomo.Item
	file: DirTree.Item
	setting?: any
	text: string
	active: boolean
	index: number
	onCheck: (id: string, file: DirTree.Item) => Promise<void>
}

const Index = (props: IProps) => {
	const { item, file, active, index, changeSearchIndex, onCheck } = props
	const ref = useRef(null)
	const hover = useHover(ref)

	useEffect(() => {
		hover && changeSearchIndex(index)
	}, [hover])

	const onItem = useMemoizedFn(() => onCheck(item.file_id, file))

	return (
		<div
			id={`search_item_${item.file_id}`}
			className={$cx(
				'search_item w_100 border_box cursor_point transition_normal flex flex_column justify_center relative',
				active && 'active'
			)}
			ref={ref}
			onClick={onItem}
		>
			<ArrowBendDownLeft className='icon_go absolute right_0' weight='bold'></ArrowBendDownLeft>
			<div className='text_wrap'>{file.name}</div>
		</div>
	)
}

export default $app.memo(Index)
