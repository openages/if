import en from 'antd/locale/en_US'
import { useState } from 'react'

import { useCreateEffect } from '@/hooks'

import type { Lang } from '@/appdata'

export default (lang: Lang) => {
	const [locale, setLocale] = useState(en)

	useCreateEffect(() => {
		import(`@/locales/antd/${lang}`).then(l => setLocale(l.default))
	}, [lang])

	return locale
}
