import { LazyElement } from '@/components'
import { StackContext } from '@/context/stack'
import { useMemoizedFn } from 'ahooks'
import { useMemo } from 'react'
import styles from './index.css'

import type { IPropsStacksView } from '../../../../types'

const Index = (props: IPropsStacksView) => {
	const { column_index, view_index, module, id, width, container_width, click } = props

	const narrow = useMemo(() => width * 0.01 * container_width <= 390, [width, container_width])

	const onMouseDown = useMemoizedFn(() => click({ column: column_index, view: view_index }, true))

	return (
		<StackContext.Provider value={{ module, id, width, container_width }}>
			<div className={$cx('w_100 h_100 relative', styles.position_wrap)} onMouseDown={onMouseDown}>
				<div id={id} className={$cx('w_100 h_100', styles._local, narrow && styles.narrow)}>
					<LazyElement type='modules' path={module} params={{ id }} />
				</div>
			</div>
		</StackContext.Provider>
	)
}

export default $app.memo(Index)
