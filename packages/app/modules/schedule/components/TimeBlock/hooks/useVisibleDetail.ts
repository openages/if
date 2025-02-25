import { useMemoizedFn } from 'ahooks'
import { useState } from 'react'

import { useCreateEffect } from '@/hooks'

export default () => {
	const [visible_detail, setVisibleDetail] = useState(false)

	const closePopover = useMemoizedFn(() => {
		const popovers = document.getElementsByClassName('month_mode_timeblock_popover')

		if (!popovers.length) return

		Array.from(popovers).forEach(i => ((i as HTMLDivElement).style.display = 'none'))
	})

	const toggleVisibleDetail = useMemoizedFn(() => setVisibleDetail(!visible_detail))

	useCreateEffect(() => {
		return () => {
			closePopover()
			setVisibleDetail(false)
		}
	}, [])

	return { visible_detail, toggleVisibleDetail }
}
