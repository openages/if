import common from './index'

import type { ThemeConfig } from 'antd'

export default {
	token: {
		colorSuccess: common.color_success,
		colorWarning: common.color_warning,
		colorError: common.color_danger,
		controlHeightLG: 38,
		controlHeight: 32,
		controlHeightSM: 26,
		controlHeightXS: 20,
		lineHeight: common.line_height,
		fontFamily: 'var(--font_family)',
		controlOutline: 'none'
	}
} as ThemeConfig
