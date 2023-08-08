import { useLayoutEffect } from 'react'
import { useTranslation } from 'react-i18next'

export default () => {
	const { t, i18n } = useTranslation()

	useLayoutEffect(() => {
		$t = t
	}, [t, i18n.language])
}
