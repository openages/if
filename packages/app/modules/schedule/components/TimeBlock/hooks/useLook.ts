import { useMemo } from 'react'

import styles from '../index.css'

import type { IPropsTimeBlock } from '@/modules/schedule/types'

interface Args extends Pick<IPropsTimeBlock, 'item' | 'month_mode' | 'step'> {
	timeline: boolean
}

export default (args: Args) => {
	const { item, month_mode, step, timeline } = args

	return useMemo(() => {
		if (timeline) {
			return {
				class: ['absolute', styles.timeline],
				style: {
					left: `calc(${item.start * step}px + 1.5px)`,
					width: `calc(${item.length * step}px - 3px)`
				}
			}
		}

		if (month_mode) {
			return {
				class: ['relative', styles.month_mode],
				style: {}
			}
		}

		return {
			class: [
				'absolute',
				item.length === 1 && styles.small,
				item.length === 2 && styles.middle,
				item.length === 3 && styles.large,
				item.length > 3 && styles.xlarge,
				item.past && styles.past
			],
			style: {
				top: `calc(${item.start * 16}px + 1.5px)`,
				left: 1.5,
				width: `calc(100% - 3px)`,
				height: `calc(${item.length * 16}px - 3px)`
			}
		}
	}, [item, month_mode, step, timeline])
}
