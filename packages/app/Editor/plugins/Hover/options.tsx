import { Copy, Link, Trash } from '@phosphor-icons/react'

import type { MenuProps } from 'antd'

export default [
	{
		label: 'Copy Link',
		icon: <Link />,
		key: 'copy_link'
	},
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
