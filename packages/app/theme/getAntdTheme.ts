import { match } from 'ts-pattern'

import common_antd from './common/antd'
import dark from './dark'
import light from './light'

import type { Theme } from '@/appdata'
import type { ThemeConfig } from 'antd'

export const getVars = (theme: Theme) => {
	return match(theme)
		.with('light', () => light)
		.with('dark', () => dark)
		.exhaustive()
}

export default (theme: Theme, color_main: string) => {
	const vars = getVars(theme)

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
			colorFillTertiary: vars.color_bg_1,
			colorBorder: theme === 'dark' ? vars.color_border : vars.color_border_light,
			colorBorderSecondary: vars.color_border_light,
			controlItemBgActive: vars.color_bg_2,
			switchHeight: 34,
			boxShadow: vars.shadow,
			borderRadiusXS: 3,
			borderRadiusSM: 6,
			borderRadius: 6
		},
		components: {
			Select: {
				colorPrimary: vars.color_text,
				optionActiveBg: vars.color_bg_2,
				optionPadding: '4px 8px',
				colorBorder: 'transparent'
			},
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
				colorPrimary: vars.color_text,
				colorPrimaryHover: vars.color_text_grey
			},
			Segmented: {
				borderRadiusSM: 6,
				borderRadiusXS: 4,
				controlHeightSM: 24,
				colorBgLayout: vars.color_bg_1
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
			Checkbox: {
				colorPrimary: vars.color_text_sub,
				colorPrimaryHover: vars.color_text,
				lineType: 'none'
			},
			Tabs: {
				colorPrimary: vars.color_text
			},
			Pagination: {
				controlHeight: 24
			}
		}
	} as ThemeConfig
}
