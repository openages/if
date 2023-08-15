import { useMemo } from 'react'
import { useTranslation } from 'react-i18next'

import { limits } from '@/appdata'

import type { Lang } from '@/appdata'

export default () => {
	const {
		i18n: { language }
	} = useTranslation()

	return useMemo(() => limits[language as Lang], [language])
}
