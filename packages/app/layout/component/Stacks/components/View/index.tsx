import { LazyElement } from '@/components'
import { useElementScrollRestoration } from '@/hooks'
import styles from './index.css'

import type { IPropsStacksView } from '../../../../types'

const Index = (props: IPropsStacksView) => {
	const { module, id } = props
	const scroll_restore = useElementScrollRestoration('todo.dirtree')

	return (
		<div id={id} className={$cx('w_100 h_100', styles._local)} {...scroll_restore}>
			<LazyElement type='modules' path={module} params={{ id }} />
		</div>
	)
}

export default $app.memo(Index)
