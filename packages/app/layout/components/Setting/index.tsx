import { useMemoizedFn } from 'ahooks'
import { Button, Drawer, Tabs } from 'antd'
import { observer } from 'mobx-react-lite'
import { useEffect, useMemo, useState, Fragment } from 'react'
import { useTranslation } from 'react-i18next'
import { container } from 'tsyringe'

import { Modal, ModuleIcon, Wave } from '@/components'
import { useSize } from '@/hooks'
import { List } from '@phosphor-icons/react'

import styles from './index.css'
import Model from './model'
import { getModuleItems, getSettingItems } from './options'

import type { IPropsSetting } from '@/layout/types'
import type { App } from '@/types'

const Index = (props: IPropsSetting) => {
	const { visible, onClose } = props
	const [x] = useState(() => container.resolve(Model))
	const { t } = useTranslation()
	const body_width = useSize(() => document.body, 'width') as number

	useEffect(() => {
		if (!body_width) return

		x.mini = body_width <= 840
	}, [body_width])

	const setting_items = useMemo(() => getSettingItems(t), [t])
	const module_items = useMemo(() => getModuleItems(t), [t])

	const getRef = useMemoizedFn(v => (x.ref = v))
	const onToggleMenu = useMemoizedFn(() => (x.visible_menu = !x.visible_menu))

	const Menu = (
		<div className={$cx('h_100 border_box flex', styles.menu)}>
			<div className='menu_items w_100 border_box flex flex_column'>
				{setting_items.map(({ label, Icon, key }) => (
					<Wave key={key}>
						<Button
							className={$cx(
								'menu_item border_box flex justify_start align_center',
								x.active === key && 'active'
							)}
							onMouseDown={() => {
								x.active = key
								x.visible_menu = false
							}}
						>
							<Icon className='icon_module'></Icon>
							<span className='menu_name'>{label}</span>
						</Button>
					</Wave>
				))}
				<div className='divider w_100 border_box'></div>
				{module_items.map(({ label, key }) => (
					<Wave key={key}>
						<Button
							className={$cx(
								'menu_item border_box flex justify_start align_center',
								x.active === key && 'active'
							)}
							onMouseDown={() => {
								x.active = key
								x.visible_menu = false
							}}
						>
							<ModuleIcon
								className='icon_module'
								type={key as App.ModuleType}
								size={18}
							></ModuleIcon>
							<span className='menu_name'>{label}</span>
						</Button>
					</Wave>
				))}
			</div>
		</div>
	)

	return (
		<Modal
			className={$cx('relative', styles.modal)}
			open={visible}
			zIndex={2000}
			maskClosable
			disablePadding
			getRef={getRef}
			onCancel={onClose}
		>
			{x.mini ? (
				<Fragment>
					<div
						className='btn_toggle_menu flex justify_center align_center absolute clickable'
						onClick={onToggleMenu}
					>
						<List size={15}></List>
					</div>
					<Drawer
						rootClassName={styles.menu_drawer}
						maskClassName={styles.menu_drawer_mask}
						open={x.visible_menu}
						placement='left'
						closeIcon={false}
						width={150}
						maskClosable
						rootStyle={{ position: 'absolute' }}
						getContainer={() => x.ref}
						onClose={onToggleMenu}
					>
						{Menu}
					</Drawer>
				</Fragment>
			) : (
				Menu
			)}
			<div className={$cx('h_100 border_box flex flex_column', styles._local)}>
				<Tabs
					items={module_items.concat(setting_items)}
					activeKey={x.active}
					renderTabBar={() => null}
					destroyInactiveTabPane
				></Tabs>
			</div>
		</Modal>
	)
}

export default new $app.handle(Index).by(observer).by($app.memo).get()
