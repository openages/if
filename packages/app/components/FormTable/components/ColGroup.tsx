import type { IPropsColGroup } from '../types'

const Index = (props: IPropsColGroup) => {
	const { columns } = props

	return (
		<colgroup>
			{columns.map(item => (
				<col width={item.width || 'auto'} key={item.dataIndex || item.title} />
			))}
		</colgroup>
	)
}

export default $app.memo(Index)
