import { lazy, useMemo, Suspense } from 'react'
import { match } from 'ts-pattern'

import type { ReactNode } from 'react'

interface IProps {
	type: 'modules' | 'dev' | 'search' | 'editor_modal'
	path: string
	props?: any
	placeholder?: ReactNode
}

const Index = (_props: IProps) => {
	const { type, path, props, placeholder } = _props

	const Component = useMemo(() => {
		return match(type)
			.with('dev', () => lazy(() => import(`@/dev/__Panel__`)))
			.with('modules', () => lazy(() => import(`@/modules/${path}`)))
			.with('search', () => lazy(() => import(`@/layout/components/Search/components/${path}`)))
			.with('editor_modal', () => lazy(() => import(`@/Editor/modals/${path}`)))
			.exhaustive()
	}, [type, path])

	return (
		<Suspense fallback={placeholder}>
			<Component {...props} />
		</Suspense>
	)
}

export default $app.memo(Index)
