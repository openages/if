import { useScrollToItem } from '@/hooks'

import type { IPropsTabsItem } from '../../types'

const Index = (props: IPropsTabsItem) => {
	const { item, active, setCurrentAngleId } = props

	useScrollToItem(item.id, active)

	return (
		<div
			className={$cx('tab_item_wrap border_box inline_block cursor_point relative', active && 'active')}
			onMouseDown={() => setCurrentAngleId(item.id)}
		>
			<span className='tab_name'>{item.text}</span>
		</div>
	)
}

export default $app.memo(Index)
