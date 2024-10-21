import { useMutationObserver } from 'ahooks'
import { useEffect, useMemo, useRef, useState } from 'react'

import { getComputedStyleValue } from '@/utils'

import styles from './index.css'
import Item from './Item'
import Latest from './Latest'

import type { IPropsMenu } from '../../types'
import type { CSSProperties } from 'react'

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
	const [max_height, setMaxHeight] = useState(0)

	const blocks = useMemo(() => latest_blocks.map(item => all_options[item]), [all_options, latest_blocks])

	useEffect(() => {
		const observer = new IntersectionObserver(
			entries => {
				console.log(entries)

				// entries.forEach(entry => {
				// 	if (!entry.boundingClientRect.width) return

				// 	const height_bounding = entry.boundingClientRect.height
				// 	const height_intersection = entry.intersectionRect.height

				// 	if (height_bounding !== height_intersection) {
				// 		setMaxHeight(height_intersection)
				// 	} else {
				// 		// setMaxHeight(0)
				// 	}
				// })
			},
			{ root: null, rootMargin: '0px', threshold: 0 }
		)

		observer.observe(ref.current!)

		return () => observer.disconnect()
	}, [])

	// useEffect(() => {
	// 	// const timer = setInterval(() => {
	// 	// 	if (!ref.current) return

	// 	// 	const rect = ref.current.getBoundingClientRect()

	// 	// 	console.log(rect)
	// 	// }, 1000)

	// 	// return () => clearInterval(timer)

	// 	if (!ref.current) return

	// 	const rect = ref.current.getBoundingClientRect()
	// 	console.log(rect)

	// 	if (rect.top < 0) {
	// 		setMaxHeight(window.innerHeight + rect.top - 12)
	// 		ref.current.parentElement!.style.display = 'flex'
	// 		ref.current.parentElement!.style.alignItems = 'flex-end'
	// 	} else {
	// 		setMaxHeight(0)
	// 	}
	// }, [])

	const style = useMemo(() => {
		if (!max_height) return {}

		return { maxHeight: max_height } as CSSProperties
	}, [max_height])

	console.log(style)

	return (
		<div className={$cx('flex flex_column border_box', styles._local)} ref={ref} style={style}>
			<If condition={!text_mode && blocks.length > 0}>
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
