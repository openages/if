import common from './index'

import type { ThemeConfig } from 'antd'

export default {
	token: {
		colorSuccess: common.color_success,
		colorWarning: common.color_warning,
		colorError: common.color_danger,
		controlHeight: 38,
		controlHeightXS: 18,
		controlHeightSM: 26,
		controlHeightLG: 50,
		lineType: 'dotted',
		fontFamily: `'Outfit', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue',
		Arial, 'Noto Sans', sans-serif, 'Apple Color Emoji', 'Segoe UI Emoji', 'Segoe UI Symbol',
		'Noto Color Emoji'`,
		controlOutline: 'none'
	}
} as ThemeConfig
