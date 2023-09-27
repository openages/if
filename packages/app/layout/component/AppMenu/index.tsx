import { Drawer } from 'antd'
import { useMemo } from 'react'
import { useTranslation } from 'react-i18next'
import { Link } from 'react-router-dom'

import { ModuleIcon } from '@/components'

import group from './group'
import styles from './index.css'

import type { IPropsAppMenu } from '../../types'
import type { App } from '@/types'

const Index = (props: IPropsAppMenu) => {
	const { visible, app_modules, actives, visible_dirtree, onClose } = props
	const { t } = useTranslation()

	const group_items = useMemo(() => {
		return Object.keys(group).reduce(
			(total, group_name: keyof typeof group) => {
				const groups = group[group_name]

				total.push({
					name: group_name,
					items: app_modules.filter((item) => groups.includes(item.title))
				})

				return total
			},
			[] as Array<{ name: keyof typeof group; items: App.Modules }>
		)
	}, [app_modules])

	return (
		<Drawer
			rootClassName={$cx('hide_mask', styles._local, !visible_dirtree && styles.no_dirtree)}
			open={visible}
			placement='left'
			destroyOnClose
			zIndex={3000}
			closeIcon={null}
			onClose={onClose}
		>
			<div className='group_items w_100 border_box flex_column'>
				{group_items.map((group, index) => (
					<div className='group_item w_100 border_box flex flex_column' key={index}>
						<span className='group_name'>{t(`translation:modules.group.${group.name}`)}</span>
						<div className='menu_items_wrap w_100 border_box flex flex_column'>
							{group.items.map((item) => (
								<Link
									className={$cx(
										'menu_item border_box flex align_center clickable relative',
										actives.find((i) => i.app === item.title) && 'active'
									)}
									key={item.title}
									to={item.path}
									onClick={onClose}
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
