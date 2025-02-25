import { useMemoizedFn, useUpdateEffect } from 'ahooks'
import { debounce } from 'lodash-es'
import { useRef, useState } from 'react'

import { LoadingCircle } from '@/components'
import { useCreateEffect } from '@/hooks'
import { useDeepMemo } from '@openages/stk/react'

import { ColGroup, Header, Pagination, Row } from './components'
import styles from './index.css'

import type { IProps, IPropsHeader, IPropsColGroup } from './types'

const Index = (props: IProps) => {
	const {
		columns,
		dataSource,
		rowKey,
		loading,
		stickyTop,
		scroller,
		scrollX,
		pagination,
		onChange,
		onChangeSort,
		getRowClassName
	} = props
	const scroll_wrap = useRef<HTMLDivElement>(null)
	const [width, setWidth] = useState(0)
	const [scroll_position, setScrollPosition] = useState<'start' | 'center' | 'end' | false>(false)
	const [sort, setSort] = useState<{ field: string; order: 'desc' | 'asc' | null } | null>(null)
	const [editing_info, _setEditingInfo] = useState<
		{ row_index: number; field: string; focus: boolean } | null | undefined
	>(null)

	const setEditingInfo = useMemoizedFn(_setEditingInfo)

	const changeSort = useMemoizedFn(field => {
		if (!sort || !sort?.order) return setSort({ field, order: 'desc' })
		if (field !== sort.field) return setSort({ field, order: 'desc' })

		if (sort.order === 'desc') return setSort({ field, order: 'asc' })
		if (sort.order === 'asc') return setSort(null)
	})

	const scroll = useMemoizedFn(() => {
		const scroller = scroll_wrap.current

		if (!scroller) return

		if (!scroller.scrollLeft) {
			return setScrollPosition('start')
		}

		if (scroller.scrollLeft + scroller.clientWidth >= scroller.scrollWidth) {
			return setScrollPosition('end')
		}

		setScrollPosition('center')
	})

	const debounceScroll = useMemoizedFn(debounce(scroll, 450))

	useUpdateEffect(() => {
		if (onChangeSort) onChangeSort(sort)
	}, [sort])

	useCreateEffect(() => {
		const scroller_x = scroll_wrap.current

		if (!scroller_x) return

		const observer = new ResizeObserver(
			debounce(
				(elements: Array<ResizeObserverEntry>) => {
					const element = scroll_wrap.current

					if (!elements.length) return
					if (!element?.scrollWidth) return

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

		scroller_x.addEventListener('scroll', debounceScroll)
		observer.observe(scroller_x)

		return () => {
			scroller_x.removeEventListener('scroll', debounceScroll)
			observer.disconnect()
		}
	}, [])

	const { target_columns, exist_fixed_column, left_shadow_index, right_shadow_index } = useDeepMemo(() => {
		let exist_fixed_column = false
		let left_shadow_index = null
		let right_shadow_index = null as number | null

		const target_columns = columns.map((item, index) => {
			let sticky_items = null as IProps['columns'] | null

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
					total += col.width!

					return total
				}, 0)
			}

			if (item.fixed) exist_fixed_column = true

			return item
		})

		return { target_columns, exist_fixed_column, left_shadow_index, right_shadow_index }
	}, [columns])

	const shadow = useDeepMemo(() => {
		if (!width || !exist_fixed_column) return false
		if (width > scrollX!) return false

		return scroll_position
	}, [scrollX, exist_fixed_column, width, scroll_position])

	const props_header: IPropsHeader = {
		columns: target_columns,
		stickyTop,
		scrollerX: scroll_wrap.current!,
		scrollerY: scroller?.current!,
		left_shadow_index,
		right_shadow_index,
		sort: sort!,
		changeSort
	}

	const props_col_group: IPropsColGroup = {
		columns
	}

	return (
		<div className={$cx('w_100 flex flex_column', styles._local, shadow && styles[`shadow_${[shadow]}`])}>
			<div className='scroll_x_wrap w_100' ref={scroll_wrap}>
				<Header {...props_header}></Header>
				<div className='w_100 relative'>
					{loading && scroll_wrap.current && (
						<div
							className='table_loading_wrap h_100 flex justify_center align_center absolute'
							style={{ width: getComputedStyle(scroll_wrap.current).width }}
						>
							<LoadingCircle className='icon_loading' />
						</div>
					)}
					<table className='table_wrap w_100'>
						<ColGroup {...props_col_group}></ColGroup>
						<tbody>
							{dataSource.map((item, index) => (
								<Row
									columns={columns}
									item={item}
									index={index}
									left_shadow_index={left_shadow_index}
									right_shadow_index={right_shadow_index}
									sort={sort!}
									editing_info={
										editing_info?.row_index === index && editing_info
											? editing_info
											: undefined
									}
									setEditingInfo={setEditingInfo}
									onChange={onChange}
									getRowClassName={getRowClassName}
									key={rowKey ? item[rowKey] : item.id}
								></Row>
							))}
						</tbody>
					</table>
				</div>
			</div>
			{pagination && <Pagination {...pagination}></Pagination>}
		</div>
	)
}

export default $app.memo(Index)
