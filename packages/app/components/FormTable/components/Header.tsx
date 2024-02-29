import { useDebounceEffect, useInViewport, useMemoizedFn } from 'ahooks'
import { Affix } from 'antd'
import { useEffect, useRef, useState, Fragment } from 'react'

import styles from '../index.css'
import ColGroup from './ColGroup'
import Th from './Th'

import type { IPropsHeader } from '../types'

const Index = (props: IPropsHeader) => {
	const { columns, stickyTop, scrollerX, scrollerY, left_shadow_index, right_shadow_index } = props
	const header = useRef<HTMLTableElement>(null)
	const [visible] = useInViewport(header, { root: () => scrollerY })

	const scrollSync = useMemoizedFn(() => {
		if (!scrollerX || visible) return

		const affix = scrollerX.querySelector(`.${styles.Affix} .if-affix`)

		if (affix.scrollLeft === scrollerX.scrollLeft) return

		affix.scrollLeft = scrollerX.scrollLeft
	})

	useEffect(() => {
		if (!scrollerX || !scrollerY || visible) return

		scrollerX.addEventListener('scroll', scrollSync)
		scrollerY.addEventListener('scroll', scrollSync)

		return () => {
			scrollerX.removeEventListener('scroll', scrollSync)
			scrollerY.removeEventListener('scroll', scrollSync)
		}
	}, [scrollerX, scrollerY, visible])

	useDebounceEffect(
		() => {
			if (!visible) scrollSync()
		},
		[visible],
		{ wait: 30 }
	)

	const Content = (
		<table className='w_100 table_wrap relative'>
			<ColGroup columns={columns}></ColGroup>
			<thead>
				<tr>
					{columns.map((item, index) => (
						<Th
							title={item.title}
							sort={item.sort}
							align={item.align}
							fixed={item.fixed}
							stickyOffset={item.stickyOffset}
							shadow={
								(left_shadow_index === index ? 'start' : '') ||
								(right_shadow_index === index ? 'end' : '')
							}
							key={item.dataIndex || item.title}
						></Th>
					))}
				</tr>
			</thead>
		</table>
	)

	if (stickyTop !== undefined) {
		return (
			<Fragment>
				<div ref={header} style={{ visibility: 'hidden' }}></div>
				<Affix
					className={styles.Affix}
					offsetTop={!visible ? (!stickyTop ? 0.1 : stickyTop) : 0}
					target={() => scrollerY}
				>
					{Content}
				</Affix>
			</Fragment>
		)
	}

	return Content
}

export default $app.memo(Index)
