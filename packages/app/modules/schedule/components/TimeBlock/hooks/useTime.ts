import dayjs from 'dayjs'
import { useMemo } from 'react'
import { useTranslation } from 'react-i18next'

import { getCrossTime } from '../../../utils'

import type { IPropsTimeBlock } from '@/modules/schedule/types'

interface Args extends Pick<IPropsTimeBlock, 'year_scale' | 'item'> {
	timeline: boolean
}

export default (args: Args) => {
	const { year_scale, item, timeline } = args
	const { t } = useTranslation()

	return useMemo(() => {
		const start_time = dayjs(item.raw_start_time ?? item.start_time)
		const end_time = dayjs(item.raw_end_time ?? item.end_time)

		if (year_scale) {
			const months = end_time.diff(start_time, 'month')

			return {
				time: `${start_time.format('MMMM')} - ${end_time.format('MMMM')}`,
				cross_time: `${months}${t('translation:common.letter_space')}${t(
					`translation:common.time.month${months > 1 ? 's' : ''}`
				)}`
			}
		}

		const cross_time = getCrossTime(start_time, end_time, timeline)

		if (timeline) {
			return {
				time: `${start_time.format('MM.DD')} - ${end_time.format('MM.DD')}`,
				cross_time
			}
		} else {
			return {
				time: `${start_time.format('HH:mm')} - ${end_time.format('HH:mm')}`,
				cross_time
			}
		}
	}, [year_scale, item, timeline])
}
