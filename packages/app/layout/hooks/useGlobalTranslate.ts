import { useTranslation } from 'react-i18next'

import { useCreateLayoutEffect } from '@/hooks'

export default () => {
	const { t, i18n } = useTranslation()

	useCreateLayoutEffect(() => {
		$t = t
	}, [t, i18n.language])
}
