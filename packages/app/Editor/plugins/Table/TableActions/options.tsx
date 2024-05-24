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
	{
		label: 'Clone',
		icon: <Copy />,
		key: 'clone_row'
	},
	{
		label: 'Clear',
		icon: <Broom />,
		key: 'clear_row'
	},
	{
		label: 'Remove',
		icon: <Trash />,
		key: 'remove_row'
	}
] as MenuProps['items']

export const menu_col = [
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
		label: 'Header Col',
		icon: <SquareHalfBottom />,
		key: 'header_col'
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
	{
		label: 'Reset Width',
		icon: <ArrowsCounterClockwise />,
		key: 'reset_width'
	},
	{
		label: 'Clone',
		icon: <Copy />,
		key: 'clone_col'
	},
	{
		label: 'Clear',
		icon: <Broom />,
		key: 'clear_col'
	},
	{
		label: 'Remove',
		icon: <Trash />,
		key: 'remove_col'
	}
] as MenuProps['items']
