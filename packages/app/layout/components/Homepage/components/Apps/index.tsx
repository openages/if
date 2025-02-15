import { useTranslation } from 'react-i18next'

import { ModuleIcon } from '@/components'

import styles from './index.css'

import type { IPropsHomepageApps } from '@/layout/types'

const Index = (props: IPropsHomepageApps) => {
	const { apps, active, setActive } = props
	const { t } = useTranslation()

	return (
		<div className={$cx('w_100 border_box flex flex_wrap', styles._local)}>
			{apps.map(item => (
				<div
					className={$cx(
						'app_item flex justify_center align_center clickable',
						active === item.title && 'active'
					)}
					onClick={() => setActive(item.title)}
					key={item.id}
				>
					<ModuleIcon
						type={item.title}
						weight={active === item.title ? 'regular' : 'light'}
					></ModuleIcon>
				</div>
			))}
		</div>
	)
}

export default $app.memo(Index)
