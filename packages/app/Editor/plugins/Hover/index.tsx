import { useMemoizedFn } from 'ahooks'
import { ConfigProvider, Dropdown } from 'antd'
import { observer } from 'mobx-react-lite'
import { useLayoutEffect, useMemo, useState, Fragment } from 'react'
import { createPortal } from 'react-dom'
import { container } from 'tsyringe'

import { useStackSelector } from '@/context/stack'
import { useLexicalComposerContext } from '@lexical/react/LexicalComposerContext'
import { CaretDown, DotsSixVertical } from '@phosphor-icons/react'

import styles from './index.css'
import Model from './model'
import { options_common, options_heading } from './options'

import type { MenuProps } from 'antd'
import type { IPropsCommon } from '@/Editor/types'

const Index = (props: IPropsCommon) => {
	const { md } = props
	const [x] = useState(() => container.resolve(Model))
	const [editor] = useLexicalComposerContext()
	const id = useStackSelector(v => v.id)

	useLayoutEffect(() => {
		x.init(id, editor, md)

		return () => x.off()
	}, [id, editor, md])

	const options = useMemo(() => {
		if (!md || (md && x.is_heading)) return options_heading.concat(options_common)

		return options_common
	}, [md, x.is_heading])

	const onClick: MenuProps['onClick'] = useMemoizedFn(e => editor.update(() => x.onClick(e)))
	const onToggle = useMemoizedFn(() => editor.update(() => x.onToggle()))
	const onOpenChange = useMemoizedFn(v => (x.visible_menu = v))
	const onDragStart = useMemoizedFn(e => editor.update(() => x.onDragStart(e)))
	const onDragEnd = useMemoizedFn(e => editor.update(() => x.onDragEnd(e)))

	if (!x.visible_handler && !x.visible_line && !x.visible_toggle) return null

	const Content = (
		<Fragment>
			{x.visible_handler && (
				<ConfigProvider getPopupContainer={() => document.getElementById(id)}>
					<Dropdown
						destroyPopupOnHide
						trigger={['click']}
						open={x.visible_menu}
						menu={{ items: options, rootClassName: styles.dropdown_menu, onClick }}
						onOpenChange={onOpenChange}
					>
						<div
							className={$cx(
								'__editor_btn_drag absolute top_0 left_0 z_index_1000 flex justify_center align_center clickable',
								styles.btn,
								styles.btn_drag,
								(x.dragging || x.visible_menu) && styles.active
							)}
							draggable
							onDragStart={onDragStart}
							onDragEnd={onDragEnd}
							style={{
								translate: `${x.position_handler.left}px ${x.position_handler.top}px`
							}}
						>
							<DotsSixVertical size={14} weight='bold' />
						</div>
					</Dropdown>
				</ConfigProvider>
			)}
			{x.visible_line && (
				<div
					className={$cx(
						'__editor_dragline absolute top_0 left_0 z_index_1000 flex align_center',
						styles.dragline
					)}
					style={{
						width: x.style_line.width,
						translate: `${x.style_line.left}px ${x.style_line.top}px`
					}}
				></div>
			)}
			{x.visible_toggle && (
				<div
					className={$cx(
						'__editor_btn_toggle absolute top_0 left_0 z_index_1000 flex justify_center align_center clickable',
						styles.btn,
						styles.btn_toggle,
						x.fold && styles.fold
					)}
					style={{ translate: `${x.position_handler.left - 18}px ${x.position_handler.top}px` }}
					onClick={onToggle}
				>
					<CaretDown className='icon' size={12} weight='fill' />
				</div>
			)}
		</Fragment>
	)

	return createPortal(Content, document.querySelector(`#${id} .__editor_container`))
}

export default new $app.handle(Index).by(observer).by($app.memo).get()
