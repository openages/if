import { match } from 'ts-pattern'

import common_antd from './common/antd'
import dark from './dark'
import light from './light'

import type { ThemeConfig } from 'antd'
import type { Theme } from '@/appdata'

export default (theme: Theme, color_main: string) => {
	const vars = match(theme)
		.with('light', () => light)
		.with('dark', () => dark)
		.exhaustive()

	return {
		token: {
			...common_antd.token,
			colorPrimary: color_main,
			colorTextBase: vars.color_text,
			colorBgBase: vars.color_bg,
			colorBgContainer: vars.color_bg,
			colorBgElevated: vars.color_bg,
			colorBgLayout: vars.color_bg_1,
			colorBorder: vars.color_border,
			colorBorderSecondary: vars.color_border_light,
			controlItemBgActive: vars.color_bg_2,
			colorPrimaryHover: vars.color_text_grey,
			colorPrimaryTextHover: vars.color_text_grey,
			switchHeight: 34
		},
		components: {
			Segmented: {
				borderRadiusXS: 17,
				borderRadiusSM: 17,
				colorBgLayout: vars.color_bg,
				colorBgElevated: vars.color_bg_2,
			}
		}
	} as ThemeConfig
}
