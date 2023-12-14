import { Button, Tabs } from 'antd'
import { observer } from 'mobx-react-lite'
import { Fragment, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { container } from 'tsyringe'

import { Wave } from '@/components'
import { Activity, Command, Layout, Sliders } from '@phosphor-icons/react'

import AppCenter from './app_center'
import GlobalCenter from './global_center'
import styles from './index.css'
import Model from './model'
import ShortcutCenter from './shortcut_center'
import TaskCenter from './task_center'

const Index = () => {
	const [x] = useState(() => container.resolve(Model))
	const { t } = useTranslation()

	const nav_items = [
		{
			label: t('translation:setting.nav.titles.setting'),
			icon: <Sliders size={16}></Sliders>,
			key: '0',
			children: <GlobalCenter></GlobalCenter>
		},
		{
			label: t('translation:setting.nav.titles.app_center'),
			icon: <Layout size={16}></Layout>,
			key: '1',
			children: <AppCenter></AppCenter>
		},
		{
			label: t('translation:setting.nav.titles.task_center'),
			icon: <Activity size={16}></Activity>,
			key: '2',
			children: <TaskCenter></TaskCenter>
		},
		{
			label: t('translation:setting.nav.titles.shortcut_center'),
			icon: <Command size={16}></Command>,
			key: '3',
			children: <ShortcutCenter></ShortcutCenter>
		}
	]

	return (
		<Fragment>
			<div className={$cx('w_100 sticky top_0 relative', styles.menu)}>
				<div className='limited_unchanged_content_wrap w_100 h_100 border_box flex justify_center'>
					<div className='menu_items flex'>
						{nav_items.map((item, index) => (
							<Wave key={item.label}>
								<Button
									className={$cx(
										'menu_item border_box flex justify_center align_center relative z_index_10',
										x.active_index === index && 'active'
									)}
									onMouseDown={() => (x.active_index = index)}
								>
									{item.icon}
									<span className='menu_name ml_4'>{item.label}</span>
								</Button>
							</Wave>
						))}
					</div>
				</div>
			</div>
			<div className={$cx('limited_unchanged_content_wrap border_box flex flex_column', styles._local)}>
				<Tabs
					items={nav_items}
					activeKey={String(x.active_index)}
					renderTabBar={() => null}
					destroyInactiveTabPane
				></Tabs>
			</div>
		</Fragment>
	)
}

export default new $app.handle(Index).by(observer).by($app.memo).get()
