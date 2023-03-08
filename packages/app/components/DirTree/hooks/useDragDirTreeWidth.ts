import { useEventListener, useMemoizedFn } from 'ahooks'
import { useState } from 'react'

import { getComputedStyleValue } from '@/utils'

import type { MouseEvent, RefObject } from 'react'
import type { GlobalModel } from '@/context/app'

export default (global: GlobalModel, ref: RefObject<HTMLDivElement>) => {
	const [draging, setDraging] = useState(false)

	const setDirTreeWidth = useMemoizedFn((e: MouseEvent) => {
		if (!draging) return

		const dirtree_width = getComputedStyleValue(document.documentElement, '--dirtree_width')

		global.layout.setDirTreeWidth(dirtree_width + e.movementX)
	})

	useEventListener('mousedown', () => setDraging(!draging), { target: ref })
	useEventListener('mouseup', () => setDraging(false), { target: document })
	useEventListener('mousemove', setDirTreeWidth, { target: ref })
	useEventListener('mousemove', setDirTreeWidth, { target: document })

	return draging
}
