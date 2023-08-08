import { useLayoutEffect } from 'react'

import { useIntl } from '@umijs/max'

import type { App } from '@/types'

export default () => {
	const { locale, messages } = useIntl()

	useLayoutEffect(() => {
		$l = messages as any
		$locale = locale as App.LocaleType
	}, [locale, messages])
}
