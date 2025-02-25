import { useContext } from 'react'
import { VisibilityContext } from 'react-horizontal-scrolling-menu'
import scrollIntoView from 'smooth-scroll-into-view-if-needed'

import { useCreateEffect } from '@/hooks'

export default (id: string, active: boolean, isDragging?: boolean) => {
	const scroller = useContext(VisibilityContext)

	useCreateEffect(() => {
		if (isDragging) return
		if (!active) return
		if (!scroller.getItemElementById) return

		const target_item = scroller.getItemElementById(id)

		if (!target_item) return

		scrollIntoView(target_item, { behavior: 'smooth', inline: 'center', block: 'nearest' })

		const timer = setTimeout(() => {
			scrollIntoView(target_item, { behavior: 'smooth', inline: 'center', block: 'nearest' })
		}, 30)

		return () => clearTimeout(timer)
	}, [id, active, isDragging])
}
