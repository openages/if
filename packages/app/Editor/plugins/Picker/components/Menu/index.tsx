import { useMemo, useRef } from 'react'

import styles from './index.css'
import Item from './Item'
import Latest from './Latest'

import type { IPropsMenu } from '../../types'

const Index = (props: IPropsMenu) => {
	const {
		all_options,
		latest_blocks,
		options,
		selected_index,
		text_mode,
		selectOptionAndCleanUp,
		setHighlightedIndex
	} = props
	const ref = useRef<HTMLDivElement>(null)

	const blocks = useMemo(() => latest_blocks.map(item => all_options[item]), [all_options, latest_blocks])

	return (
		<div className={$cx('flex flex_column border_box relative', styles._local)} ref={ref}>
			<div className='menu_wrap w_100 border_box flex flex_column'>
				<If condition={!text_mode && blocks.length > 0}>
					<Latest blocks={blocks} selectOptionAndCleanUp={selectOptionAndCleanUp}></Latest>
				</If>
				<div className='menu_items w_100 border_box flex flex_column'>
					{options.map((option, index) => (
						<Item
							option={option}
							index={index}
							selected={selected_index === index}
							selectOptionAndCleanUp={selectOptionAndCleanUp}
							setHighlightedIndex={setHighlightedIndex}
							key={option.key}
						/>
					))}
				</div>
			</div>
		</div>
	)
}

export default $app.memo(Index)
