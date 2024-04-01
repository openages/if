import { usePrevious } from 'ahooks'
import { diff } from 'just-diff'
import { omit } from 'lodash-es'
import { cloneElement, memo, Fragment } from 'react'

import { deepEqual } from '@openages/stk/react'
import { Handle, Position } from '@xyflow/react'

import type { NodeProps, Node } from '@xyflow/react'
import type { ReactElement, ReactNode } from 'react'

interface IProps extends NodeProps {
	children: ReactElement
}

const Index = (props: IProps) => {
	const { children, data, isConnectable } = props
	const prev_data = usePrevious(data)

	// console.log(123)

	// console.log(props, deepEqual(data, prev_data), diff(prev_data || [], data))

	return (
		<Fragment>
			<Handle type='target' position={Position.Left} isConnectable={isConnectable} />
			<Handle type='source' position={Position.Right} isConnectable={isConnectable} />
			{cloneElement(children, data)}
		</Fragment>
	)
}

const Memo = (el: any) => {
	return memo(el, (prev, next) => {
		console.log(diff(prev, next), deepEqual(omit(prev, ['width', 'height']), omit(next, ['width', 'height'])))
		// if (
		// 	next.width === 0 &&
		// 	next.height === 0 &&
		// 	deepEqual(omit(prev, ['width', 'height']), omit(next, ['width', 'height']))
		// )
		// 	return true

		return deepEqual(prev, next)
	})
}

export default $app.memo(Index)
