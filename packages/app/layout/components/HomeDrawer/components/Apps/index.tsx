import { apps_home_drawer } from '@/appdata'
import { ModuleIcon } from '@/components'

import styles from './index.css'

import type { IPropsHomeDrawerApps } from '@/layout/types'

const Index = (props: IPropsHomeDrawerApps) => {
	const { active, setActive } = props

	return (
		<div className={$cx('w_100 border_box flex flex_wrap', styles._local)}>
			{apps_home_drawer.map(item => (
				<div
					className={$cx(
						'app_item flex justify_center align_center clickable',
						active === item && 'active'
					)}
					onClick={() => setActive(item)}
					key={item}
				>
					<ModuleIcon type={item} weight={active === item ? 'regular' : 'light'}></ModuleIcon>
				</div>
			))}
		</div>
	)
}

export default $app.memo(Index)
