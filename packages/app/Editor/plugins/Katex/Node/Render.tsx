import katex from 'katex'
import { useEffect, useRef } from 'react'
import { ErrorBoundary } from 'react-error-boundary'

import { Warning } from '@phosphor-icons/react'

import type { IPropsRender } from '../types'

const Index = (props: IPropsRender) => {
	const { value, inline, onClick } = props
	const ref = useRef(null)

	useEffect(() => {
		const el = ref.current

		if (!el || !value) return

		katex.render(value, el, {
			displayMode: !inline,
			errorColor: 'var(--color_danger)',
			output: 'html',
			strict: 'warn',
			throwOnError: false,
			trust: false
		})
	}, [value, inline])

	return (
		<ErrorBoundary
			fallback={
				<div>
					<Warning size={18}></Warning>
				</div>
			}
		>
			<img src='#' alt='' />
			<span ref={ref} role='button' tabIndex={-1} onClick={onClick} />
			<img src='#' alt='' />
		</ErrorBoundary>
	)
}

export default $app.memo(Index)
