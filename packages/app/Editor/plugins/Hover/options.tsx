import { Copy, Link, Trash } from '@phosphor-icons/react'

import type { MenuProps } from 'antd'

export const options_common = [
	{
		label: $t('common.clone'),
		icon: <Copy />,
		key: 'clone'
	},
	{
		label: $t('common.remove'),
		icon: <Trash />,
		key: 'remove'
	}
] as MenuProps['items']

export const options_heading = [
	{
		label: $t('common.copy') + $t('common.letter_space') + $t('common.link'),
		icon: <Link />,
		key: 'copy_link'
	}
] as MenuProps['items']
