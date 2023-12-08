import { LazyElement } from '@/components'
import { StackContext } from '@/context/stack'
import styles from './index.css'

import type { IPropsStacksView } from '../../../../types'

const Index = (props: IPropsStacksView) => {
	const { module, id } = props

	return (
		<StackContext.Provider value={{ module, id }}>
			<div className='w_100 h_100 relative'>
				<div id={id} className={$cx('w_100 h_100', styles._local)}>
					<LazyElement type='modules' path={module} params={{ id }} />
				</div>
			</div>
		</StackContext.Provider>
	)
}

export default $app.memo(Index)
