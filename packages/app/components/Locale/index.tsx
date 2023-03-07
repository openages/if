import { FormattedMessage } from '@umijs/max'

import type { App } from '@/types'

interface IProps {
	id: App.LocaleKeys
	values?: Record<string, string>
	defaultMessage?: string
}

const Index = (props: IProps) => {
	return <FormattedMessage {...props}></FormattedMessage>
}

export default $app.memo(Index)
