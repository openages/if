import { useState } from 'react'

import { useCreateLayoutEffect } from '@/hooks'

export default (timeout?: number) => {
	const [mounted, setMounted] = useState(false)

	useCreateLayoutEffect(() => {
		if (timeout) {
			const timer = setTimeout(() => setMounted(true), timeout)

			return () => clearTimeout(timer)
		} else {
			setMounted(true)
		}
	}, [timeout])

	return mounted
}
