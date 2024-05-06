import { Select } from 'antd'

import { Link, List, TextB, TextH, TextItalic, TextStrikethrough, TextUnderline } from '@phosphor-icons/react'

import styles from './index.css'

import type { IPropsFormats } from './types'

const Index = (props: IPropsFormats) => {
	const { md } = props

	return (
		<div className={$cx('flex align_center', styles._local)}>
			<div className='format_items_wrap flex'>
				<div className='btn_format flex justify_center align_center clickable'>
					<TextB weight='bold' />
				</div>
				<div className='btn_format flex justify_center align_center clickable'>
					<TextItalic weight='bold' />
				</div>
				<div className='btn_format flex justify_center align_center clickable'>
					<TextStrikethrough weight='bold' />
				</div>
				<If condition={!md}>
					<div className='btn_format flex justify_center align_center clickable'>
						<TextUnderline weight='bold' />
					</div>
				</If>
				<div className='btn_format flex justify_center align_center clickable'>
					<Link weight='bold' />
				</div>
			</div>
			<span className='d_line'></span>
			<div className='format_items_wrap flex'>
				<Select
					className='select_heading select'
					size='small'
					suffixIcon={<TextH weight='bold' />}
				></Select>
			</div>
			<span className='d_line'></span>
			<div className='format_items_wrap flex'>
				<Select
					className='select_list select'
					size='small'
					suffixIcon={<List weight='bold' />}
				></Select>
			</div>
		</div>
	)
}

export default $app.memo(Index)
