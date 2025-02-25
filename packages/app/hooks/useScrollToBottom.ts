import { useMemoizedFn } from 'ahooks'
import { debounce } from 'lodash-es'
import { useState } from 'react'

import { useCreateEffect } from '@/hooks'

export default (callback: () => void) => {
	const [node, setRef] = useState<HTMLDivElement>()

	const handler = useMemoizedFn(() => {
		if (!node) return

		if (node.scrollTop >= node.scrollHeight - node.clientHeight - 3) {
			callback()
		}
	})

	useCreateEffect(() => {
		if (!node) return

		const _hander = debounce(handler, 300)

		node.addEventListener('scroll', _hander)

		return () => node.removeEventListener('scroll', _hander)
	}, [node])

	return { setRef }
}
