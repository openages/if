import { useMemo, useRef } from 'react'

import { useSize } from '@/hooks'
import { is_mac_electron } from '@/utils'

import type { Layout, Timer } from '@/models'

export default (blur: Layout['blur'], timer: Timer['timer']) => {
	const ref_sidebar = useRef<HTMLDivElement>(null)
	const ref_items_wrap = useRef<HTMLDivElement>(null)
	const sidebar_height = useSize(() => ref_sidebar.current!, 'height') as number
	const items_height = useSize(() => ref_items_wrap.current!, 'height') as number

	const overflow = useMemo(() => {
		if (!sidebar_height || !items_height) return false

		const padding_top = !blur && is_mac_electron ? 36 : 15
		const bottom_height = timer ? 64 + 36 : 64

		if (sidebar_height - 42 - padding_top - 12 - bottom_height >= items_height) return false

		return true
	}, [sidebar_height, items_height, is_mac_electron])

	return { ref_sidebar, ref_items_wrap, overflow }
}
