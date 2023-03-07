import { useCallback } from 'react'

import { useIntl } from '@umijs/max'

import type { App } from '@/types'
import type { MessageDescriptor } from 'react-intl'

export default () => {
	const { locale, formatMessage } = useIntl()

	return useCallback(
		(id: App.LocaleKeys, options?: MessageDescriptor & { values: Record<string, string> }) => {
			const { values, ...desc } = options || {}

			return formatMessage({ id, ...desc }, values)
		},
		[locale]
	)
}
