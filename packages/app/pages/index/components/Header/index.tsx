import { Tooltip } from 'antd'
import { When } from 'react-if'

import { Files, PencilSimple } from '@phosphor-icons/react'

import styles from './index.css'

import type { IPropsHeader } from '../../types'

const Index = (props: IPropsHeader) => {
	const { name, desc } = props

	return (
		<div className={$cx('limited_content_wrap border_box flex justify_between align_center', styles._local)}>
			<div className='left_wrap flex flex_column'>
				<div className='name flex justify_between align_center'>{name}</div>
				<When condition={desc}>
					<span className='desc'>{desc}</span>
				</When>
			</div>
			<div className='actions_wrap flex align_center'>
				<Tooltip title='编辑' placement='bottom'>
					<div className='icon_wrap border_box flex justify_center align_center cursor_point clickable'>
						<PencilSimple className='icon_edit' size={16}></PencilSimple>
					</div>
				</Tooltip>
				<Tooltip title='参考资料' placement='bottom'>
					<div className='icon_wrap no_border border_box flex justify_center align_center cursor_point clickable'>
						<Files size={16}></Files>
					</div>
				</Tooltip>
			</div>
		</div>
	)
}

export default $app.memo(Index)
