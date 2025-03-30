import { useMemoizedFn } from 'ahooks'

import type { IPropsViewerItem } from '../../types'
import type { ChangeEvent } from 'react'

const Index = (props: IPropsViewerItem) => {
	const { index, content, onChangeMd } = props

	const onChange = useMemoizedFn((e: ChangeEvent<HTMLTextAreaElement>) => {
		onChangeMd(index, e.target.value)
	})

	return (
		<div className='viewer_item_wrap w_100 h_100 border_box'>
			<textarea className='textarea w_100 h_100 border_box' value={content} onChange={onChange}></textarea>
		</div>
	)
}

export default $app.memo(Index)
