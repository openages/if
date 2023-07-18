import { Suspense, lazy, useMemo } from 'react'
import { match } from 'ts-pattern'

interface IProps {
	type: 'pages' | 'modules'
	path: string
}

const Index = (props: IProps) => {
	const { type, path } = props

	const Component = useMemo(() => {
		return match(type)
			.with('pages', () => lazy(() => import(`@/pages/${path}`)))
			.with('modules', () => lazy(() => import(`@/modules/${path}`)))
			.exhaustive()
	}, [type, path])

	return (
		<Suspense>
			<Component />
		</Suspense>
	)
}

export default Index
