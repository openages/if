import { observer } from 'mobx-react-lite'

import { widgets } from '@/appdata'
import { ModuleIcon } from '@/components'
import { useGlobal } from '@/context/app'
import { useDarkIconWeight, useLocale } from '@/hooks'
import { NavLink } from '@umijs/max'

import styles from './index.css'

const Index = () => {
	const global = useGlobal()
	const l = useLocale()
	const icon_weight = useDarkIconWeight()

	return (
		<div className={$cx('limited_unchanged_content_wrap h_100vh flex align_center', styles._local)}>
			<div className={$cx('nav_items w_100 flex flex_wrap', global.setting.theme === 'dark' && 'dark')}>
				{widgets.map((item) => (
					<NavLink className='nav_item_wrap border_box' to={item.path} key={item.title}>
						<div className='nav_item flex flex_column align_center transition_normal cursor_point'>
							<ModuleIcon
								className='icon_bar'
								type={item.title}
								size={48}
								weight={icon_weight}
							></ModuleIcon>
							<span className='title mt_2'>{l(`nav_title.${item.title}`)}</span>
						</div>
					</NavLink>
				))}
			</div>
		</div>
	)
}

export default new $app.handle(Index).by(observer).by($app.memo).get()
