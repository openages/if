import { cloneElement, Fragment } from 'react'

import { Handle, Position } from '@xyflow/react'

import type { NodeProps } from '@xyflow/react'
import type { ReactElement } from 'react'

interface IProps extends NodeProps {
	children: ReactElement
}

const Index = (props: IProps) => {
	const { children, data, isConnectable } = props

	return (
		<Fragment>
			<Handle type='target' position={Position.Left} isConnectable={isConnectable} />
			<Handle type='source' position={Position.Right} isConnectable={isConnectable} />
			{cloneElement(children, data)}
		</Fragment>
	)
}

export default $app.memo(Index)
