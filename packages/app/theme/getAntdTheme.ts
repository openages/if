import { match } from 'ts-pattern'

import common_antd from './common/antd'
import dark from './dark'
import light from './light'

import type { Theme } from '@/appdata'
import type { ThemeConfig } from 'antd'

export default (theme: Theme, color_main: string) => {
	const vars = match(theme)
		.with('light', () => light)
		.with('dark', () => dark)
		.exhaustive()

	return {
		token: {
			...common_antd.token,
			colorPrimary: `rgb(${color_main})`,
			colorText: vars.color_text,
			colorTextBase: vars.color_text,
			colorBgBase: vars.color_bg,
			colorBgContainer: vars.color_bg,
			colorBgElevated: vars.color_bg,
			colorBgLayout: vars.color_bg_1,
			colorBorder: theme === 'dark' ? vars.color_border : vars.color_border_light,
			colorBorderSecondary: vars.color_border_light,
			controlItemBgActive: vars.color_bg_2,
			switchHeight: 34,
			boxShadow: vars.shadow,
			borderRadius: 6,
			borderRadiusSM: 6,
			borderRadiusXS: 6
		},
		components: {
			Switch: {
				colorPrimary: vars.color_text,
				controlHeight: 24,
				controlHeightSM: 22,
				controlHeightXS: 20
			},
			DatePicker: {
				colorPrimary: vars.color_text,
				controlHeight: 24,
				cellHeight: 24,
				cellWidth: 24,
				timeCellHeight: 24,
				timeColumnWidth: 36,
				textHeight: 30,
				fontSize: 12,
				colorSplit: 'transparent'
			},
			Dropdown: {
				controlItemBgHover: vars.color_bg_2
			},
			Input: {
				colorPrimary: vars.color_text
			},
			Select: {
				colorPrimary: vars.color_text,
				optionActiveBg: vars.color_bg_2
			},
			Segmented: {
				borderRadiusSM: 20,
				borderRadiusXS: 20,
				controlHeightSM: 20,
				colorBgLayout: vars.color_bg_2
			},
			Slider: {
				handleSize: 8,
				handleSizeHover: 10
			},
			Radio: {
				colorPrimary: vars.color_text,
				dotSize: 9,
				radioSize: 12
			},
			Tabs: {
				colorPrimary: vars.color_text
			}
		}
	} as ThemeConfig
}
