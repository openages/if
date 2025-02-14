import { useMemo, useRef } from 'react'

import { useSize } from '@/hooks'

import type { Timer } from '@/models'

export default (padding: boolean) => {
	const ref_sidebar = useRef<HTMLDivElement>(null)
	const ref_items_wrap = useRef<HTMLDivElement>(null)
	const sidebar_height = useSize(() => ref_sidebar.current!, 'height') as number
	const items_height = useSize(() => ref_items_wrap.current!, 'height') as number

	const overflow = useMemo(() => {
		if (!sidebar_height || !items_height) return false

		const padding_top = padding ? 36 : 15

		if (sidebar_height - 42 - padding_top - 12 - 64 >= items_height) return false

		return true
	}, [sidebar_height, items_height, padding])

	return { ref_sidebar, ref_items_wrap, overflow }
}
