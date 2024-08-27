import { FileImage, LinkSimple } from '@phosphor-icons/react'

import type { SegmentedProps } from 'antd'

export default [
	{
		label: 'URL',
		value: 'URL',
		icon: <LinkSimple />
	},
	{
		label: 'File',
		value: 'File',
		icon: <FileImage />
	}
] as SegmentedProps<any>['options']
