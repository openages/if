import { useMemoizedFn } from 'ahooks'

import type { IPropsItem } from '../../types'

const Index = (props: IPropsItem) => {
	const { option, index, selected, selectOptionAndCleanUp, setHighlightedIndex } = props
	const { title, icon, key, setRefElement } = option

	const onMouseEnter = useMemoizedFn(() => setHighlightedIndex(index))

	const onClick = useMemoizedFn(() => {
		selectOptionAndCleanUp(option)
		setHighlightedIndex(index)
	})

	return (
		<div
			className={$cx('picker_menu_item flex align_center cursor_point', selected && 'selected')}
			role='option'
			aria-selected={selected}
			ref={setRefElement}
			onMouseEnter={onMouseEnter}
			onClick={onClick}
			key={key}
		>
			<div className='icon_wrap flex mr_6'>{icon}</div>
			<span className='text'>{title}</span>
		</div>
	)
}

export default $app.memo(Index)
