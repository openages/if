import { Copy, Link, Trash } from '@phosphor-icons/react'

import type { MenuProps } from 'antd'

export default [
	{
		label:
			$t('translation:common.copy') + $t('translation:common.letter_space') + $t('translation:common.link'),
		icon: <Link />,
		key: 'copy_link'
	},
	{
		label: $t('translation:common.clone'),
		icon: <Copy />,
		key: 'clone'
	},
	{
		label: $t('translation:common.remove'),
		icon: <Trash />,
		key: 'remove'
	}
] as MenuProps['items']
