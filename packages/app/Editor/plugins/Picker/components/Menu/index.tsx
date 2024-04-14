import Item from '../Item'
import styles from './index.css'

import type { IPropsMenu } from '../../types'

const Index = (props: IPropsMenu) => {
	const { options, selected_index, selectOptionAndCleanUp, setHighlightedIndex } = props

	return (
		<div className={$cx('flex flex_column border_box', styles._local)}>
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
