import { useMemoizedFn } from 'ahooks'
import { omit } from 'lodash-es'

import type { IPropsTimeBlock } from '@/modules/schedule/types'

interface Args extends Pick<IPropsTimeBlock, 'item' | 'copyTimeBlock' | 'removeTimeBlock'> {
	toggleVisibleDetail: () => void
}

export default (args: Args) => {
	const { item, copyTimeBlock, removeTimeBlock, toggleVisibleDetail } = args

	const stopPropagationContextMenu = useMemoizedFn(e => e.stopPropagation())

	const onKeyDown = useMemoizedFn(e => {
		if (e.key === 'Enter' || e.key === 'Tab') {
			e.preventDefault()
		}
	})

	const onAction = useMemoizedFn(({ key }) => {
		switch (key) {
			case 'check':
				toggleVisibleDetail()
				break
			case 'copy':
				copyTimeBlock(omit(item, 'id'))
				break
			case 'remove':
				removeTimeBlock(item.id)
				break
		}
	})

	return { stopPropagationContextMenu, onKeyDown, onAction }
}
