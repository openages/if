import { cloneElement, Fragment } from 'react'

import { Handle, Position } from '@xyflow/react'

import type { NodeProps } from '@xyflow/react'
import type { ReactElement } from 'react'

interface IProps extends NodeProps {
	children: ReactElement
	no_left_handle?: boolean
	no_right_handle?: boolean
}

const Index = (props: IProps) => {
	const { children, data, isConnectable, no_left_handle, no_right_handle } = props

	return (
		<Fragment>
			<Handle type='target' position={Position.Left} isConnectable={isConnectable} />
			<Handle type='source' position={Position.Right} isConnectable={isConnectable} />
			{cloneElement(children, $copy(data))}
		</Fragment>
	)
}

export default $app.memo(Index)
