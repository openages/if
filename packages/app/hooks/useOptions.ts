import { useMemo } from 'react'
import { useTranslation } from 'react-i18next'

export default (options: Array<string | number | boolean>, locale?: boolean | string) => {
	const { t, i18n } = useTranslation()

	return locale
		? useMemo(() => {
				const locale_prefix = typeof locale === 'boolean' ? 'common' : locale

				return Array.from(options).map(item => ({
					// @ts-ignore
					label: t(`${locale_prefix}.${item}`),
					value: item
				}))
			}, [options, i18n.language])
		: useMemo(() => {
				return Array.from(options).map(item => ({
					label: item,
					value: item
				}))
			}, [])
}
