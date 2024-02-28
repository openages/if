import { useDeepMemo } from '@openages/stk/react'

import ColGroup from './ColGroup'
import Th from './Th'

import type { IPropsHeader } from '../types'
import type { CSSProperties } from 'react'

const Index = (props: IPropsHeader) => {
	const { columns, stickyTop, left_shadow_index, right_shadow_index } = props

	const style = useDeepMemo(() => {
		const target = {} as CSSProperties

		if (stickyTop !== undefined) {
			target['position'] = 'sticky'
			target['top'] = 0
			target['zIndex'] = 100
		}

		return target
	}, [stickyTop])

	return (
		<div className='w_100 sticky' style={style}>
			<table className='w_100 table_wrap'>
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
		</div>
	)
}

export default $app.memo(Index)
