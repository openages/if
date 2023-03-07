import { useLayoutEffect } from 'react'

import { useIntl } from '@umijs/max'

export default () => {
	const { locale, messages } = useIntl()

	useLayoutEffect(() => {
		$l = messages as any
	}, [locale, messages])
}
