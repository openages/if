import TodoItem from '../../TodoItem'
import NodeWrapper from './NodeWrapper'

import type { NodeProps } from '@xyflow/react'
import type { ReactElement } from 'react'

const Index = (props: NodeProps) => {
	return <NodeWrapper children={TodoItem as unknown as ReactElement} {...props} />
}

export default $app.memo(Index)
