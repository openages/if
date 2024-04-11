import ChildrenItem from '../../Children/Item'
import { useContext } from '../context'
import NodeWrapper from './NodeWrapper'

import type { NodeProps } from '@xyflow/react'
import type { ReactElement } from 'react'

const Index = (props: NodeProps) => {
	const context = useContext(v => ({ update: v.update, tab: v.tab }))

	const data = {
		...props.data,
		...context,
		useByMindmap: true
	}

	return <NodeWrapper children={ChildrenItem as unknown as ReactElement} {...props} data={data} />
}

export default $app.memo(Index)
