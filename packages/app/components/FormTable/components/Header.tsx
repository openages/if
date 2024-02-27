import Th from './Th'

import type { IPropsHeader } from '../types'

const Index = (props: IPropsHeader) => {
	const { columns, stickyTop, left_shadow_index, right_shadow_index } = props

	return (
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
	)
}

export default $app.memo(Index)
