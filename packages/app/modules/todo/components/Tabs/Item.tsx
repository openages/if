import type { IPropsTabsItem } from '../../types'
import { useScrollToItem } from '@/hooks'

const Index = (props: IPropsTabsItem) => {
	const { item, is_active, setCurrentAngleId } = props

	useScrollToItem(item.id, is_active)

	return (
		<div
			className={$cx(
				'tab_item_wrap border_box inline_block cursor_point clickable relative',
				is_active && 'active'
			)}
			onMouseDown={() => setCurrentAngleId(item.id)}
		>
			<span className='tab_name transition_normal'>{item.text}</span>
		</div>
	)
}

export default $app.memo(Index)
