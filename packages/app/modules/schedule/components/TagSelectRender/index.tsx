import styles from './index.css'

import type { ReactNode } from 'react'

interface IProps {
	label: ReactNode
}

const Index = ({ label }: IProps) => {
	const target_arr = (label as string).split('|')

	return (
		<div className={$cx('w_100 flex align_center', styles._local)}>
			<span className='tag_color mr_6' style={{ backgroundColor: target_arr[1] }}></span>
			<span className='text'>{target_arr[0]}</span>
		</div>
	)
}

export default Index
