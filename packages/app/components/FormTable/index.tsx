import { useMemoizedFn } from 'ahooks'
import { debounce } from 'lodash-es'
import { useEffect, useMemo, useRef, useState } from 'react'

import { ColGroup, Header, Pagination, Row } from './components'
import styles from './index.css'

import type { IProps, IPropsHeader, IPropsPagination, IPropsColGroup } from './types'

const Index = (props: IProps) => {
	const { columns, dataSource, rowKey, loading, stickyTop, scrollX, onChange } = props
	const ref_container = useRef<HTMLDivElement>(null)
	const ref_table = useRef<HTMLTableElement>(null)
	const [width, setWidth] = useState(0)
	const [scroll_position, setScrollPosition] = useState<'start' | 'center' | 'end' | false>(false)

	const scroll = useMemoizedFn(() => {
		const element = ref_container.current

		if (!element.scrollLeft) {
			return setScrollPosition('start')
		}

		if (element.scrollLeft + element.clientWidth >= element.scrollWidth) {
			return setScrollPosition('end')
		}

		setScrollPosition('center')
	})

	const debounceScroll = useMemoizedFn(debounce(scroll, 450))

	useEffect(() => {
		const element = ref_container.current

		if (!element) return

		const observer = new ResizeObserver(
			debounce(
				(elements: Array<ResizeObserverEntry>) => {
					if (!elements.length) return
					const element = ref_container.current

					if (element.scrollWidth > element.clientWidth) {
						scroll()
					} else {
						setScrollPosition(false)
					}

					setWidth(elements[0].contentRect.width)
				},
				450,
				{ leading: true }
			)
		)

		element.addEventListener('scroll', debounceScroll)
		observer.observe(element)

		return () => {
			element.removeEventListener('scroll', debounceScroll)
			observer.disconnect()
		}
	}, [])

	const { target_columns, exist_fixed_column, left_shadow_index, right_shadow_index } = useMemo(() => {
		let exist_fixed_column = false
		let left_shadow_index = null
		let right_shadow_index = null

		const target_columns = columns.map((item, index) => {
			let sticky_items = null as IProps['columns']

			if (item.fixed === 'left') {
				left_shadow_index = index

				sticky_items = columns.filter((col, idx) => idx < index && col.fixed === 'left')
			}

			if (item.fixed === 'right') {
				if (right_shadow_index === null) {
					right_shadow_index = index
				}

				sticky_items = columns.filter((col, idx) => idx > index && col.fixed === 'right')
			}

			if (sticky_items) {
				item['stickyOffset'] = sticky_items.reduce((total, col) => {
					total += col.width

					return total
				}, 0)
			}

			if (item.fixed) exist_fixed_column = true

			return item
		})

		return { target_columns, exist_fixed_column, left_shadow_index, right_shadow_index }
	}, [columns])

	const shadow = useMemo(() => {
		if (!width || !exist_fixed_column) return false
		if (width > scrollX) return false

		return scroll_position
	}, [scrollX, exist_fixed_column, width, scroll_position])

	const props_header: IPropsHeader = {
		columns: target_columns,
		stickyTop,
		left_shadow_index,
		right_shadow_index
	}

	const props_col_group: IPropsColGroup = {
		columns
	}

	const props_pagination: IPropsPagination = {
		columns
	}

	return (
		<div
			className={$cx(
				'w_100 flex flex_column relative',
				styles._local,
				shadow && styles[`shadow_${[shadow]}`]
			)}
			ref={ref_container}
		>
			<table className='table_wrap w_100' ref={ref_table}>
				<ColGroup {...props_col_group}></ColGroup>
				<Header {...props_header}></Header>
				<tbody>
					{dataSource.map((item, index) => (
						<Row
							columns={columns}
							item={item}
							index={index}
							left_shadow_index={left_shadow_index}
							right_shadow_index={right_shadow_index}
							onChange={onChange}
							key={rowKey ? item[rowKey] : item.id}
						></Row>
					))}
				</tbody>
			</table>
			<Pagination {...props_pagination}></Pagination>
		</div>
	)
}

export default $app.memo(Index)
