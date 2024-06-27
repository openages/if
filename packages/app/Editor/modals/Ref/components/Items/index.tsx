import Item from './Item'

import type { IPropsItems } from '../../types'

const Index = (props: IPropsItems) => {
	const { latest_items, onItem } = props

	return (
		<div className='latest_items_wrap border_box flex flex_column'>
			<span className='latest_title'>Latest items</span>
			<div className='flex flex_column'>
				{latest_items.map((item, index) => (
					<Item {...{ item, index, onItem }} key={index}></Item>
				))}
			</div>
		</div>
	)
}

export default $app.memo(Index)
