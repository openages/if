import { useLayoutEffect, useRef } from 'react'

import { deepEqual } from '@openages/stk/react'

import type { EffectCallback, DependencyList } from 'react'

export default (callback: EffectCallback, deps: DependencyList) => {
	const ref_deps = useRef<DependencyList>()

	useLayoutEffect(() => {
		if (deepEqual(ref_deps.current, deps)) return

		ref_deps.current = deps

		callback()
	}, deps)
}
