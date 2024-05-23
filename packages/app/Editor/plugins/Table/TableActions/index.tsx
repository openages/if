import { useMemoizedFn } from 'ahooks'
import { ConfigProvider, Dropdown } from 'antd'
import { observer } from 'mobx-react-lite'
import { useLayoutEffect, useMemo, useState, Fragment } from 'react'
import { createPortal } from 'react-dom'
import { container } from 'tsyringe'

import { useStackSelector } from '@/context/stack'
import { useLexicalComposerContext } from '@lexical/react/LexicalComposerContext'
import {
	ArrowFatDown,
	ArrowFatLeft,
	ArrowFatRight,
	ArrowFatUp,
	Broom,
	Copy,
	SquareHalf,
	SquareHalfBottom,
	TextAlignCenter,
	TextAlignLeft,
	TextAlignRight,
	Trash
} from '@phosphor-icons/react'

import styles from './index.css'
import Model from './model'

import type { MenuProps } from 'antd'
const Index = () => {
	const [x] = useState(() => container.resolve(Model))
	const [editor] = useLexicalComposerContext()
	const id = useStackSelector(v => v.id)
	const [exist, setExsit] = useState(false)

	useLayoutEffect(() => {
		x.init(id, editor)
	}, [id, editor])

	useLayoutEffect(() => {
		if (x.visible) return setExsit(true)

		const timer = setTimeout(() => {
			setExsit(false)
		}, 180)

		return () => clearTimeout(timer)
	}, [x.visible])

	const menu_common = useMemo(
		() =>
			[
				{
					label: 'Clone',
					icon: <Copy />,
					key: 'clone'
				},
				{
					label: 'Clear',
					icon: <Broom />,
					key: 'clear'
				},
				{
					label: 'Remove',
					icon: <Trash />,
					key: 'remove'
				}
			] as MenuProps['items'],
		[]
	)

	const menu_row = useMemo(() => {
		return [
			{
				label: 'Header Row',
				icon: <SquareHalf />,
				key: 'header_row'
			},
			{
				label: 'Insert Above',
				icon: <ArrowFatUp />,
				key: 'insert_above'
			},
			{
				label: 'Insert Below',
				icon: <ArrowFatDown />,
				key: 'insert_below'
			},
			...menu_common
		] as MenuProps['items']
	}, [])

	const menu_col = useMemo(() => {
		return [
			{
				label: 'Header Col',
				icon: <SquareHalfBottom />,
				key: 'header_col'
			},
			{
				label: 'Align',
				icon: <TextAlignCenter />,
				key: 'align',
				children: [
					{
						label: 'Left',
						icon: <TextAlignLeft />,
						key: 'left'
					},
					{
						label: 'Center',
						icon: <TextAlignCenter />,
						key: 'center'
					},
					{
						label: 'Right',
						icon: <TextAlignRight />,
						key: 'right'
					}
				]
			},
			{
				label: 'Insert Left',
				icon: <ArrowFatLeft />,
				key: 'insert_left'
			},
			{
				label: 'Insert Right',
				icon: <ArrowFatRight />,
				key: 'insert_right'
			},
			...menu_common
		] as MenuProps['items']
	}, [])

	const onRowOpenChange = useMemoizedFn(v => (x.visible_menu_type = (v ? 'row' : '') as Model['visible_menu_type']))
	const onColOpenChange = useMemoizedFn(v => (x.visible_menu_type = (v ? 'col' : '') as Model['visible_menu_type']))

	if (!exist) return null

	const Content = x.visible && (
		<Fragment>
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
					menu={{ items: menu_row, rootClassName: styles.dropdown_menu }}
					onOpenChange={onRowOpenChange}
				>
					<div
						className={$cx(
							'btn_action_row btn_action flex flex_column justify_center align_center absolute clickable cursor_point',
							x.visible_menu_type === 'row' && 'active'
						)}
					>
						<span className='dot'></span>
						<span className='dot'></span>
						<span className='dot'></span>
					</div>
				</Dropdown>
			</div>
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
						menu={{ items: menu_col, rootClassName: styles.dropdown_menu }}
						onOpenChange={onColOpenChange}
					>
						<div
							className={$cx(
								'btn_action_col btn_action flex justify_center align_center absolute clickable',
								x.visible_menu_type === 'col' && 'active'
							)}
						>
							<span className='dot'></span>
							<span className='dot'></span>
							<span className='dot'></span>
						</div>
					</Dropdown>
				</ConfigProvider>
			</div>
		</Fragment>
	)

	return createPortal(Content, document.getElementById(id))
}

export default new $app.handle(Index).by(observer).by($app.memo).get()
