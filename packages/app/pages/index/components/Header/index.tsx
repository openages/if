import { Tooltip } from 'antd'
import { ArchiveBox, Files } from 'phosphor-react'

import styles from './index.css'

import type { IPropsHeader } from '../../types'

const Index = (props: IPropsHeader) => {
	const { info } = props

	return (
		<div className={$cx('limited_content_wrap border_box flex', styles._local)}>
			<div className='left_wrap flex flex_column'>
				<span className='name'>{info.name}</span>
				<span className='desc'>{info.desc}</span>
			</div>
			<div className='right_wrap flex justify_end align_center'>
				<Tooltip title='参考资料' placement='top'>
					<div className='icon_wrap flex justify_center align_center cursor_point clickable mr_12'>
						<Files size={18}></Files>
					</div>
				</Tooltip>
				<Tooltip title='归档' placement='top'>
					<div className='icon_wrap flex justify_center align_center cursor_point clickable'>
						<ArchiveBox size={18}></ArchiveBox>
					</div>
				</Tooltip>
			</div>
		</div>
	)
}

export default $app.memo(Index)
