import { lazy, useMemo, Suspense } from 'react'
import { match } from 'ts-pattern'

interface IProps {
	type: 'modules' | 'dev'
	path: string
	params?: any
}

const Index = (props: IProps) => {
	const { type, path, params } = props

	const Component = useMemo(() => {
		return match(type)
			.with('dev', () => lazy(() => import(`@/dev/__Panel__`)))
			.with('modules', () => lazy(() => import(`@/modules/${path}`)))
			.exhaustive()
	}, [type, path])

	return (
		<Suspense>
			<Component {...params} />
		</Suspense>
	)
}

export default $app.memo(Index)
