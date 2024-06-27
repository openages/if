import Item from './Item'

import type { IPropsFiles } from '../../types'

const Index = (props: IPropsFiles) => {
	const { latest_files, onItem } = props

	return (
		<div className='latest_items_wrap border_box flex flex_column'>
			<span className='latest_title'>Latest files</span>
			<div className='flex flex_column'>
				{latest_files.map((item, index) => (
					<Item {...{ item, index, onItem }} key={index}></Item>
				))}
			</div>
		</div>
	)
}

export default $app.memo(Index)
