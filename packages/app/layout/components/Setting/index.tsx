import { useMemoizedFn } from 'ahooks'
import { Button, Drawer, Tabs } from 'antd'
import { observer } from 'mobx-react-lite'
import { useEffect, useLayoutEffect, useMemo, useState, Fragment, ReactElement } from 'react'
import { useTranslation } from 'react-i18next'
import { container } from 'tsyringe'

import { version_name } from '@/appdata'
import { Modal, ModuleIcon, Wave } from '@/components'
import { useSize } from '@/hooks'
import { Infinity, List } from '@phosphor-icons/react'

import styles from './index.css'
import Model from './model'
import { getModuleItems, getSettingItems, UserTypeIcon } from './options'

import type { IPropsSetting } from '@/layout/types'
import type { App } from '@/types'

const Index = (props: IPropsSetting) => {
	const { visible, onClose } = props
	const [x] = useState(() => container.resolve(Model))
	const auth = x.global.auth
	const { t } = useTranslation()
	const body_width = useSize(() => document.body, 'width') as number

	useLayoutEffect(() => {
		x.on()

		return () => x.off()
	}, [])

	useEffect(() => {
		if (!body_width) return

		x.mini = body_width <= 840
	}, [body_width])

	const setting_items = useMemo(() => getSettingItems(t), [t])
	const module_items = useMemo(() => getModuleItems(t), [t])
	const UserIcon = useMemo(() => UserTypeIcon[auth.user.paid_plan], [auth.user.paid_plan])

	const getRef = useMemoizedFn(v => (x.ref = v))
	const onToggleMenu = useMemoizedFn(() => (x.visible_menu = !x.visible_menu))
	const goBilling = useMemoizedFn(() => (x.active = 'paid'))

	const Menu = (
		<div className={$cx('h_100 border_box flex flex_column', styles.menu)}>
			<div className='settings_wrap flex flex_column'>
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
			<div className='user_padding_wrap w_100 border_box'>
				<div className='user_wrap h_100 border_box flex align_center relative' onClick={goBilling}>
					<span className='badge flex justify_center align_center absolute top_0 right_0'>
						{version_name}
					</span>
					<span className='icon_wrap flex justify_center align_center'>
						<Choose>
							<When condition={auth.user.is_infinity}>
								<Infinity size={27}></Infinity>
							</When>
							<Otherwise>
								<UserIcon weight='light'></UserIcon>
							</Otherwise>
						</Choose>
					</span>
					<div className='flex flex_column'>
						<span className='user_type'>{t(`setting.User.${auth.user.paid_plan}.title`)}</span>
						<Choose>
							<When condition={!auth.user.is_infinity}>
								<span className='desc'>
									{t(`setting.User.${auth.user.paid_plan}.desc`)}
								</span>
							</When>
							<Otherwise>
								<span className='desc'>{t(`setting.User.infinity.desc`)}</span>
							</Otherwise>
						</Choose>
					</div>
				</div>
			</div>
		</div>
	)

	return (
		<Modal
			className={$cx('relative', styles.modal)}
			bodyClassName={styles.modal_body}
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
						className='btn_toggle_menu flex justify_center align_center absolute clickable no_drag'
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
						width={180}
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
					items={module_items!.concat(setting_items as any)}
					activeKey={x.active}
					renderTabBar={() => null as unknown as ReactElement}
					destroyInactiveTabPane
				></Tabs>
			</div>
		</Modal>
	)
}

export default new $app.handle(Index).by(observer).by($app.memo).get()
