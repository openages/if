import common from './index'

import type { ThemeConfig } from 'antd'

export default {
	token: {
		colorSuccess: common.color_success,
		colorWarning: common.color_warning,
		colorError: common.color_danger,
		controlHeightLG: 50,
		controlHeight: 38,
		controlHeightSM: 32,
		controlHeightXS: 26,
		lineType: 'dashed',
		lineHeight: common.line_height,
		fontFamily: 'var(--font_family)',
		controlOutline: 'none'
	}
} as ThemeConfig
