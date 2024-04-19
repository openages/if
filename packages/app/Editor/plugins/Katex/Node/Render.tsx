import { useLayoutEffect, useRef, Fragment } from 'react'

import type { IPropsRender } from '../types'

const Index = (props: IPropsRender) => {
	const { value, inline, onClick } = props
	const ref = useRef(null)

	useLayoutEffect(() => {
		const el = ref.current

		if (!el || !value) return

		import('katex').then(({ default: katex }) => {
			katex.render(value, el, {
				displayMode: !inline,
				errorColor: 'var(--color_danger)',
				output: 'html',
				strict: 'warn',
				throwOnError: false,
				trust: false
			})
		})
	}, [value, inline])

	return (
		<Fragment>
			<img src='#' alt='' />
			<span ref={ref} role='button' tabIndex={-1} onClick={onClick} />
			<img src='#' alt='' />
		</Fragment>
	)
}

export default $app.memo(Index)
