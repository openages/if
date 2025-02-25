import { useState } from 'react'

import { useCreateEffect } from '@/hooks'

export default (value: unknown) => {
	const [changing, setChanging] = useState(false)

	useCreateEffect(() => {
		setChanging(true)

		const timer = setTimeout(() => setChanging(false), 450)

		return () => clearTimeout(timer)
	}, [value])

	return changing
}
