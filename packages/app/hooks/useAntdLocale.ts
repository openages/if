import en from 'antd/locale/en_US'
import zh from 'antd/locale/zh_CN'
import { useMemo } from 'react'

import type { Lang } from '@/appdata'

const lang_map = {
	en,
	zh
}

export default (lang: Lang) => {
	return useMemo(() => lang_map[lang], [lang])
}
