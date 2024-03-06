import { useSize } from 'ahooks'
import { useMemo, useRef } from 'react'

import { is_mac_electron } from '@/utils'

import type { Timer } from '@/models'

export default (timer: Timer['timer']) => {
	const ref_sidebar = useRef<HTMLDivElement>(null)
	const ref_items_wrap = useRef<HTMLDivElement>(null)
	const sidebar_size = useSize(ref_sidebar)
	const items_size = useSize(ref_items_wrap)

	const overflow = useMemo(() => {
		if (!sidebar_size?.height || !items_size?.height) return false

		const padding_top = is_mac_electron ? 36 : 15
		const bottom_height = timer ? 64 + 36 : 64

		if (sidebar_size.height - 42 - padding_top - 12 - bottom_height >= items_size.height) return false

		return true
	}, [sidebar_size, items_size, is_mac_electron])

	return { ref_sidebar, ref_items_wrap, overflow }
}
