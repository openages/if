import { LazyElement } from '@/components'
import styles from './index.css'

import type { IPropsStacksView } from '../../../../types'

const Index = (props: IPropsStacksView) => {
	const { module, id } = props

	return (
		<div id={id} className={$cx('w_100 h_100', styles._local)}>
			<LazyElement type='modules' path={module} params={{ id }} />
		</div>
	)
}

export default $app.memo(Index)
