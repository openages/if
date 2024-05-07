import { useMemoizedFn } from 'ahooks'
import { Select } from 'antd'

import {
	CodeSimple,
	Link,
	List,
	TextB,
	TextH,
	TextItalic,
	TextStrikethrough,
	TextUnderline
} from '@phosphor-icons/react'

import styles from './index.css'

import type { IPropsFormats } from './types'
const Index = (props: IPropsFormats) => {
	const { md, setRef, onFormat } = props

	const onBold = useMemoizedFn(() => onFormat('bold'))
	const onItalic = useMemoizedFn(() => onFormat('italic'))
	const onStrikethrough = useMemoizedFn(() => onFormat('strikethrough'))
	const onUnderline = useMemoizedFn(() => onFormat('underline'))
	const onCode = useMemoizedFn(() => onFormat('code'))
	const onLink = useMemoizedFn(() => onFormat('link'))
	const onHeading = useMemoizedFn(v => onFormat('heading', v))
	const onList = useMemoizedFn(v => onFormat('list', v))

	return (
		<div className={$cx('flex align_center', styles._local)} ref={v => setRef(v)}>
			<div className='format_items_wrap flex'>
				<div className='btn_format flex justify_center align_center clickable' onClick={onBold}>
					<TextB weight='bold' />
				</div>
				<div className='btn_format flex justify_center align_center clickable' onClick={onItalic}>
					<TextItalic weight='bold' />
				</div>
				<div
					className='btn_format flex justify_center align_center clickable'
					onClick={onStrikethrough}
				>
					<TextStrikethrough weight='bold' />
				</div>
				<If condition={!md}>
					<div
						className='btn_format flex justify_center align_center clickable'
						onClick={onUnderline}
					>
						<TextUnderline weight='bold' />
					</div>
				</If>
				<div className='btn_format flex justify_center align_center clickable' onClick={onCode}>
					<CodeSimple weight='bold' />
				</div>
				<div className='btn_format flex justify_center align_center clickable' onClick={onLink}>
					<Link weight='bold' />
				</div>
			</div>
			<span className='d_line'></span>
			<div className='format_items_wrap flex'>
				<Select
					className='select_heading select'
					size='small'
					suffixIcon={<TextH weight='bold' />}
					onChange={onHeading}
				></Select>
			</div>
			<span className='d_line'></span>
			<div className='format_items_wrap flex'>
				<Select
					className='select_list select'
					size='small'
					suffixIcon={<List weight='bold' />}
					onChange={onList}
				></Select>
			</div>
		</div>
	)
}

export default $app.memo(Index)
