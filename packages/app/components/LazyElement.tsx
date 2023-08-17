import { Suspense, lazy, useMemo } from 'react'
import { match } from 'ts-pattern'

interface IProps {
	type: 'pages'
	path: string
	params?: any
}

const Index = (props: IProps) => {
	const { type, path, params } = props

	const Component = useMemo(() => {
		return match(type)
			.with('pages', () => lazy(() => import(`@/pages/${path === 'todo' ? 'index' : path}`)))
			.exhaustive()
	}, [type, path])

	return (
		<Suspense>
			<Component {...params} />
		</Suspense>
	)
}

export default Index
