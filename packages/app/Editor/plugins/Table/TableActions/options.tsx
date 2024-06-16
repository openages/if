import {
	ArrowsCounterClockwise,
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

import type { MenuProps } from 'antd'

export const menu_row = [
	{
		label: $t('translation:editor.Table.actions.header_col'),
		icon: <SquareHalf />,
		key: 'header_row'
	},
	{
		label: $t('translation:editor.Table.actions.insert_above'),
		icon: <ArrowFatUp />,
		key: 'insert_above'
	},
	{
		label: $t('translation:editor.Table.actions.insert_below'),
		icon: <ArrowFatDown />,
		key: 'insert_below'
	},
	{
		label: $t('translation:common.clone'),
		icon: <Copy />,
		key: 'clone_row'
	},
	{
		label: $t('translation:common.clear'),
		icon: <Broom />,
		key: 'clear_row'
	},
	{
		label: $t('translation:common.remove'),
		icon: <Trash />,
		key: 'remove_row'
	}
] as MenuProps['items']

export const menu_col = [
	{
		label: $t('translation:editor.Table.actions.align.title'),
		icon: <TextAlignCenter />,
		key: 'align',
		children: [
			{
				label: $t('translation:editor.Table.actions.align.left'),
				icon: <TextAlignLeft />,
				key: 'left'
			},
			{
				label: $t('translation:editor.Table.actions.align.center'),
				icon: <TextAlignCenter />,
				key: 'center'
			},
			{
				label: $t('translation:editor.Table.actions.align.right'),
				icon: <TextAlignRight />,
				key: 'right'
			}
		]
	},
	{
		label: $t('translation:editor.Table.actions.header_col'),
		icon: <SquareHalfBottom />,
		key: 'header_col'
	},
	{
		label: $t('translation:editor.Table.actions.insert_left'),
		icon: <ArrowFatLeft />,
		key: 'insert_left'
	},
	{
		label: $t('translation:editor.Table.actions.insert_right'),
		icon: <ArrowFatRight />,
		key: 'insert_right'
	},
	{
		label: $t('translation:editor.Table.actions.reset_width'),
		icon: <ArrowsCounterClockwise />,
		key: 'reset_width'
	},
	{
		label: $t('translation:common.clone'),
		icon: <Copy />,
		key: 'clone_col'
	},
	{
		label: $t('translation:common.clear'),
		icon: <Broom />,
		key: 'clear_col'
	},
	{
		label: $t('translation:common.remove'),
		icon: <Trash />,
		key: 'remove_col'
	}
] as MenuProps['items']
