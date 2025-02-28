import { useInViewport, useMemoizedFn } from 'ahooks'
import { useEffect, useMemo, useRef, Fragment } from 'react'

import ColGroup from './ColGroup'
import Th from './Th'

import type { IPropsHeader } from '../types'

const Index = (props: IPropsHeader) => {
	const { columns, stickyTop, scrollerX, scrollerY, left_shadow_index, right_shadow_index, sort, changeSort } =
		props
	const signal = useRef<HTMLTableElement>(null)
	const th_wrap = useRef<HTMLTableElement>(null)
	const [visible] = useInViewport(signal, { root: () => scrollerY })
	const sticky = useMemo(() => stickyTop !== undefined && scrollerX && !visible, [stickyTop, scrollerX, visible])

	const scrollSync = useMemoizedFn(() => {
		if (!scrollerX || visible || !th_wrap.current) return

		if (th_wrap.current.scrollLeft === scrollerX.scrollLeft) return

		th_wrap.current.scrollLeft = scrollerX.scrollLeft
	})

	useEffect(() => {
		if (stickyTop === undefined || !scrollerX || visible) return

		scrollerX.addEventListener('scroll', scrollSync)

		return () => scrollerX.removeEventListener('scroll', scrollSync)
	}, [stickyTop, scrollerX, visible])

	useEffect(() => {
		if (!visible) scrollSync()
	}, [visible])

	const Content = (
		<div
			className={$cx('w_100 table_th_wrap', sticky && 'absolute')}
			style={
				sticky
					? {
							top: stickyTop,
							zIndex: 102,
							overflowX: 'scroll',
							width: getComputedStyle(scrollerX).width
						}
					: {}
			}
			ref={th_wrap}
		>
			<table className='w_100 table_wrap'>
				<ColGroup columns={columns}></ColGroup>
				<thead>
					<tr>
						{columns.map((item, index) => (
							<Th
								title={item.title}
								dataIndex={item.dataIndex}
								showSort={item.sort!}
								sort={
									item.sort && sort?.field === item.dataIndex && sort
										? sort
										: undefined
								}
								align={item.align}
								fixed={item.fixed}
								stickyOffset={item.stickyOffset}
								shadow={
									(left_shadow_index === index ? 'start' : '') ||
									(right_shadow_index === index ? 'end' : '')
								}
								changeSort={item.sort ? changeSort : undefined}
								key={item.dataIndex || item.title}
							></Th>
						))}
					</tr>
				</thead>
			</table>
		</div>
	)

	if (stickyTop !== undefined) {
		return (
			<Fragment>
				<div ref={signal} style={{ visibility: 'hidden' }}></div>
				{Content}
				{!visible && <div className='w_100' style={{ height: 30 }}></div>}
			</Fragment>
		)
	}

	return Content
}

export default $app.memo(Index)
