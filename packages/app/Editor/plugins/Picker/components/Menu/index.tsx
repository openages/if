import { useMemo } from 'react'

import styles from './index.css'
import Item from './Item'
import Latest from './Latest'

import type { IPropsMenu } from '../../types'

const Index = (props: IPropsMenu) => {
	const { all_options, latest_blocks, options, selected_index, selectOptionAndCleanUp, setHighlightedIndex } = props

	const blocks = useMemo(() => latest_blocks.map(item => all_options[item]), [all_options, latest_blocks])

	return (
		<div className={$cx('flex flex_column border_box', styles._local)}>
			<If condition={blocks.length > 0}>
				<Latest blocks={blocks} selectOptionAndCleanUp={selectOptionAndCleanUp}></Latest>
			</If>
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
	)
}

export default $app.memo(Index)
