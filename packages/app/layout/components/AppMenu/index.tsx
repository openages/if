import { useMemoizedFn } from 'ahooks'
import { Drawer } from 'antd'
import { useMemo } from 'react'
import { useTranslation } from 'react-i18next'
import { useLocation } from 'react-router'
import { Link } from 'react-router-dom'

import { getGroupModules } from '@/appdata'
import { ModuleIcon } from '@/components'

import styles from './index.css'

import type { App } from '@/types'
import type { IPropsAppMenu } from '../../types'

const Index = (props: IPropsAppMenu) => {
	const { visible, app_modules, actives, visible_dirtree, onClose } = props
	const { t } = useTranslation()
	const { pathname } = useLocation()

	const group_items = useMemo(() => getGroupModules(app_modules), [app_modules])

	const getStatus = useMemoizedFn((item: App.Module) => {
		const is_current = pathname === item.path

		if (actives.find(i => i.app === item.title)) {
			return is_current ? 'active current' : 'active'
		}
	})

	return (
		<Drawer
			rootClassName={$cx(styles._local, !visible_dirtree && styles.no_dirtree)}
			open={visible}
			placement='left'
			destroyOnClose
			zIndex={100000}
			closeIcon={null}
			getContainer={document.body}
			onClose={onClose}
		>
			<div className='group_items w_100 border_box flex_column'>
				{group_items.map((group, index) => (
					<div className='group_item w_100 border_box flex flex_column' key={index}>
						<span className='group_name'>{t(`translation:modules.group.${group.name}`)}</span>
						<div className='menu_items_wrap w_100 border_box flex flex_column'>
							{group.items.map(item => (
								<Link
									className={$cx(
										'menu_item border_box flex align_center clickable relative',
										getStatus(item)
									)}
									key={item.title}
									to={item.path}
									onClick={e => {
										if (item.event) {
											e.preventDefault()

											$app.Event.emit(item.event)
										}

										onClose()
									}}
								>
									<div className='icon_wrap flex justify_center align_center'>
										<ModuleIcon
											type={item.title}
											size={24}
											weight='duotone'
										></ModuleIcon>
									</div>
									<span className='app_name'>
										{t(`translation:modules.${item.title}`)}
									</span>
								</Link>
							))}
						</div>
					</div>
				))}
			</div>
		</Drawer>
	)
}

export default $app.memo(Index)
