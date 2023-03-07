import { useIntl } from '@umijs/max'

import type { App } from '@/types'

export default () => {
	const { locale } = useIntl()

	return locale as App.LocaleType
}
