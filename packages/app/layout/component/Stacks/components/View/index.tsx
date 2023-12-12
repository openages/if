import { LazyElement } from '@/components'
import { StackContext } from '@/context/stack'
import { useMemoizedFn } from 'ahooks'
import styles from './index.css'

import type { IPropsStacksView } from '../../../../types'

const Index = (props: IPropsStacksView) => {
	const { column_index, view_index, module, id, width, click } = props

	const onMouseDown = useMemoizedFn(() => click({ column: column_index, view: view_index }, true))

	return (
		<StackContext.Provider value={{ module, id, width }}>
			<div className={$cx('w_100 h_100 relative', styles.position_wrap)} onMouseDown={onMouseDown}>
				<div id={id} className={$cx('w_100 h_100', styles._local)}>
					<LazyElement type='modules' path={module} params={{ id }} />
				</div>
			</div>
		</StackContext.Provider>
	)
}

export default $app.memo(Index)
