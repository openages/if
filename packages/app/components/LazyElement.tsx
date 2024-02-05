import { lazy, useMemo, Suspense } from 'react'
import { match } from 'ts-pattern'

interface IProps {
	type: 'modules' | 'dev' | 'search'
	path: string
	props?: any
}

const Index = (_props: IProps) => {
	const { type, path, props } = _props

	const Component = useMemo(() => {
		return match(type)
			.with('dev', () => lazy(() => import(`@/dev/__Panel__`)))
			.with('modules', () => lazy(() => import(`@/modules/${path}`)))
			.with('search', () => lazy(() => import(`@/layout/components/Search/components/${path}`)))
			.exhaustive()
	}, [type, path])

	return (
		<Suspense>
			<Component {...props} />
		</Suspense>
	)
}

export default $app.memo(Index)
