import { useMemoizedFn } from 'ahooks'
import { ConfigProvider, Dropdown } from 'antd'
import { observer } from 'mobx-react-lite'
import { useLayoutEffect, useState, Fragment } from 'react'
import { createPortal } from 'react-dom'
import { container } from 'tsyringe'

import { useStackSelector } from '@/context/stack'
import { useLexicalComposerContext } from '@lexical/react/LexicalComposerContext'

import styles from './index.css'
import Model from './model'
import { menu_col, menu_row } from './options'

import type { MenuProps } from 'antd'

const Index = () => {
	const [x] = useState(() => container.resolve(Model))
	const [editor] = useLexicalComposerContext()
	const id = useStackSelector(v => v.id)

	useLayoutEffect(() => {
		x.init(id, editor)
	}, [id, editor])

	const onRowOpenChange = useMemoizedFn(v => (x.visible_menu_type = (v ? 'row' : '') as Model['visible_menu_type']))
	const onColOpenChange = useMemoizedFn(v => (x.visible_menu_type = (v ? 'col' : '') as Model['visible_menu_type']))
	const setRefOverlay = useMemoizedFn(v => (x.ref_overlay = v))

	const onClick: MenuProps['onClick'] = useMemoizedFn(e => {
		editor.update(() => x.onClick(e))
	})

	if (!x.visible) return null

	const Content = (
		<Fragment>
			{x.position_row.left && x.position_row.top && (
				<div
					className={$cx(
						'fixed z_index_100 border_box flex align_center',
						styles.action,
						styles.action_row
					)}
					style={{ left: x.position_row.left, top: x.position_row.top }}
				>
					<Dropdown
						destroyPopupOnHide
						trigger={['click']}
						open={x.visible_menu_type === 'row'}
						menu={{ items: menu_row, rootClassName: styles.dropdown_menu, onClick }}
						onOpenChange={onRowOpenChange}
					>
						<div
							className={$cx(
								'btn_action_row btn_action flex flex_column justify_center align_center absolute clickable cursor_point',
								(x.visible_menu_type === 'row' || x.dragging_type === 'row') && 'active'
							)}
							ref={x.setRefBtnRow}
						>
							<span className='dot'></span>
							<span className='dot'></span>
							<span className='dot'></span>
						</div>
					</Dropdown>
				</div>
			)}
			{x.position_col.left && x.position_col.top && (
				<div
					className={$cx(
						'fixed z_index_100 border_box flex align_center',
						styles.action,
						styles.action_col
					)}
					style={{ left: x.position_col.left, top: x.position_col.top }}
				>
					<ConfigProvider getPopupContainer={() => document.getElementById(id)}>
						<Dropdown
							destroyPopupOnHide
							trigger={['click']}
							open={x.visible_menu_type === 'col'}
							menu={{ items: menu_col, rootClassName: styles.dropdown_menu, onClick }}
							onOpenChange={onColOpenChange}
						>
							<div
								className={$cx(
									'btn_action_col btn_action flex justify_center align_center absolute clickable',
									(x.visible_menu_type === 'col' || x.dragging_type === 'col') &&
										'active'
								)}
								ref={x.setRefBtnCol}
							>
								<span className='dot'></span>
								<span className='dot'></span>
								<span className='dot'></span>
							</div>
						</Dropdown>
					</ConfigProvider>
				</div>
			)}
			{x.position_dragline.left && x.position_dragline.top && (
				<div
					className={$cx('fixed z_index_100', styles.dragline)}
					style={{
						left: x.position_dragline.left,
						top: x.position_dragline.top,
						width: x.dragging_type === 'row' ? x.position_dragline.width : 2,
						height: x.dragging_type === 'col' ? x.position_dragline.height : 2
					}}
				></div>
			)}
		</Fragment>
	)

	return createPortal(Content, document.getElementById(id))
}

export default new $app.handle(Index).by(observer).by($app.memo).get()
