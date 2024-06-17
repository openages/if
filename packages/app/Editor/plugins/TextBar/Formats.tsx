import { useMemoizedFn } from 'ahooks'
import { Select } from 'antd'

import {
	CodeSimple,
	Link,
	List,
	ListBullets,
	ListChecks,
	ListNumbers,
	TextB,
	TextH,
	TextItalic,
	TextStrikethrough,
	TextUnderline
} from '@phosphor-icons/react'

import styles from './index.css'

import type { IPropsFormats } from './types'

const Index = (props: IPropsFormats) => {
	const { md, formats, heading_type, list_type, setRef, onFormat } = props

	const getRef = useMemoizedFn(v => setRef(v))
	const onBold = useMemoizedFn(() => onFormat('bold'))
	const onItalic = useMemoizedFn(() => onFormat('italic'))
	const onStrikethrough = useMemoizedFn(() => onFormat('strikethrough'))
	const onUnderline = useMemoizedFn(() => onFormat('underline'))
	const onCode = useMemoizedFn(() => onFormat('code'))
	const onLink = useMemoizedFn(() => onFormat('link'))
	const onHeading = useMemoizedFn(v => onFormat('heading', v))
	const onList = useMemoizedFn(v => onFormat('list', v))

	return (
		<div className={$cx('flex align_center', styles._local)} ref={getRef}>
			<div className='format_items_wrap flex'>
				<div
					className={$cx(
						'btn_format flex justify_center align_center clickable',
						formats['bold'] && 'active'
					)}
					onClick={onBold}
				>
					<TextB weight='bold' />
				</div>
				<div
					className={$cx(
						'btn_format flex justify_center align_center clickable',
						formats['italic'] && 'active'
					)}
					onClick={onItalic}
				>
					<TextItalic weight='bold' />
				</div>
				<div
					className={$cx(
						'btn_format flex justify_center align_center clickable',
						formats['strikethrough'] && 'active'
					)}
					onClick={onStrikethrough}
				>
					<TextStrikethrough weight='bold' />
				</div>
				<If condition={!md}>
					<div
						className={$cx(
							'btn_format flex justify_center align_center clickable',
							formats['underline'] && 'active'
						)}
						onClick={onUnderline}
					>
						<TextUnderline weight='bold' />
					</div>
				</If>
				<div
					className={$cx(
						'btn_format flex justify_center align_center clickable',
						formats['code'] && 'active'
					)}
					onClick={onCode}
				>
					<CodeSimple weight='bold' />
				</div>
				<div
					className={$cx(
						'btn_format flex justify_center align_center clickable',
						formats['link'] && 'active'
					)}
					onClick={onLink}
				>
					<Link weight='bold' />
				</div>
			</div>
			<span className='d_line'></span>
			<div className='format_items_wrap flex'>
				<Select
					className={$cx('select_heading select', formats['heading'] && 'active')}
					popupClassName={styles.dropdown}
					size='small'
					virtual={false}
					popupMatchSelectWidth={false}
					dropdownAlign={{ offset: [-4, 6] }}
					suffixIcon={<TextH weight='bold' />}
					options={[
						{ label: 'H1', value: 'h1' },
						{ label: 'H2', value: 'h2' },
						{ label: 'H3', value: 'h3' },
						{ label: 'H4', value: 'h4' },
						{ label: 'H5', value: 'h5' },
						{ label: 'H6', value: 'h6' }
					]}
					value={heading_type}
					onSelect={onHeading}
				></Select>
			</div>
			<span className='d_line'></span>
			<div className='format_items_wrap flex'>
				<Select
					className={$cx('select_list select', formats['list'] && 'active')}
					popupClassName={styles.dropdown}
					size='small'
					virtual={false}
					popupMatchSelectWidth={false}
					dropdownAlign={{ offset: [-4, 6] }}
					suffixIcon={<List weight='bold' />}
					options={[
						{ label: <ListBullets weight='bold' />, value: 'bullet' },
						{ label: <ListNumbers weight='bold' />, value: 'number' },
						{ label: <ListChecks weight='bold' />, value: 'check' }
					]}
					value={list_type}
					onSelect={onList}
				></Select>
			</div>
		</div>
	)
}

export default $app.memo(Index)
