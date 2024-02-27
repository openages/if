import { useMemo } from 'react'

import type { CSSProperties } from 'react'
import type { IProps, Column } from '../types'

interface Args {
	align: Column['align']
	fixed: Column['fixed']
	stickyOffset: Column['stickyOffset']
}

export default (args: Args) => {
	const { align, fixed, stickyOffset } = args

	return useMemo(() => {
		const target = {} as CSSProperties

		if (align) target['textAlign'] = align

		if (fixed) {
			target['position'] = 'sticky'

			if (fixed === 'left') target['left'] = stickyOffset
			if (fixed === 'right') target['right'] = stickyOffset
		}

		return target
	}, [align, fixed, stickyOffset])
}
