import { useMemoizedFn } from 'ahooks'
import { debounce } from 'lodash-es'
import { useState, useEffect } from 'react'

export default (callback: () => void) => {
	const [node, setRef] = useState<HTMLDivElement>(null)

	const handler = useMemoizedFn(() => {
		if (!node) return

		if (node.scrollTop >= node.scrollHeight - node.clientHeight - 3) {
			callback()
		}
	})

	useEffect(() => {
		if (!node) return

		const _hander = debounce(handler, 300)

		node.addEventListener('scroll', _hander)

		return () => node.removeEventListener('scroll', _hander)
	}, [node])

	return { setRef }
}
