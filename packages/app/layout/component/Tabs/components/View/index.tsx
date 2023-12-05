import { LazyElement } from '@/components'
import { useElementScrollRestoration } from '@/hooks'
import styles from './index.css'

import type { IPropsTabsView } from '../../../../types'

const Index = (props: IPropsTabsView) => {
	const { module, id } = props
	const scroll_restore = useElementScrollRestoration('todo.dirtree')

	return (
		<div id={id} className={$cx('w_100 h_100', styles._local)} {...scroll_restore}>
			<LazyElement type='modules' path={module} params={{ id }} />
		</div>
	)
}

export default $app.memo(Index)
