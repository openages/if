import { deepEqual } from 'fast-equals'
import { useRef } from 'react'

export default <TKey, TValue>(memoFn: () => TValue, key: TKey): TValue => {
	const ref = useRef<{ key: TKey; value: TValue }>()

	if (!ref.current || !deepEqual(key, ref.current.key)) {
		ref.current = { key, value: memoFn() }
	}

	return ref.current.value
}
