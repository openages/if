import { useMemoizedFn } from 'ahooks'
import { useMemo } from 'react'

import { LazyElement } from '@/components'
import { StackContext } from '@/context/stack'

import styles from './index.css'

import type { IPropsStacksView } from '../../../../types'

const Index = (props: IPropsStacksView) => {
	const { column_index, view_index, module, id, width, container_width, click } = props

	const breakpoint = useMemo(() => {
		if (!container_width) return

		const target_width = width * 0.01 * container_width

		if (target_width <= 390) return 390
		if (target_width <= 801) return 801

		return
	}, [width, container_width])

	const onMouseDown = useMemoizedFn(() => click({ column: column_index, view: view_index }, true))

	return (
		<StackContext.Provider value={{ module, id, width, container_width, breakpoint }}>
			<div className={$cx('w_100 h_100 relative', styles.position_wrap)} onMouseDown={onMouseDown}>
				<div
					id={id}
					className={$cx(
						'__view_container w_100 h_100',
						styles._local,
						breakpoint === 390 && styles.breakpoint_390
					)}
				>
					<LazyElement type='modules' path={module} props={{ id }} />
				</div>
			</div>
		</StackContext.Provider>
	)
}

export default $app.memo(Index)
