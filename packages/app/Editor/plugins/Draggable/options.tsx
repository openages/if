import { Copy, Trash } from '@phosphor-icons/react'

import type { MenuProps } from 'antd'

export default [
	{
		label: 'Clone',
		icon: <Copy />,
		key: 'clone'
	},
	{
		label: 'Remove',
		icon: <Trash />,
		key: 'remove'
	}
] as MenuProps['items']
