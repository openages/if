import { useStyle } from '../hooks'

import type { IPropsTh } from '../types'

const Index = (props: IPropsTh) => {
	const { title, sort, align, fixed, stickyOffset, shadow } = props
	const style = useStyle({ align, fixed, stickyOffset })

	return (
		<th
			className={$cx(
				'form_table_th',
				shadow && 'shadow',
				shadow && (shadow === 'start' ? 'shadow_start' : 'shadow_end')
			)}
			style={style}
		>
			{title}
		</th>
	)
}

export default $app.memo(Index)
