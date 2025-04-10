import { useMemoizedFn } from 'ahooks'
import { observer } from 'mobx-react-lite'
import { useEffect, useLayoutEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { container } from 'tsyringe'

import { stopPropagation } from '@/Editor/utils'
import { useLexicalComposerContext } from '@lexical/react/LexicalComposerContext'
import { useLexicalNodeSelection } from '@lexical/react/useLexicalNodeSelection'
import {
	AlignCenterHorizontalSimple,
	AlignLeftSimple,
	AlignRightSimple,
	ArrowsOut,
	ArrowCounterClockwise,
	CornersIn,
	CornersOut,
	ImageBroken,
	Trash
} from '@phosphor-icons/react'

import { IPropsImage } from '../types'
import styles from './index.css'
import Model from './model'

import type { CSSProperties } from 'react'
const Index = (props: IPropsImage) => {
	const { src, width = 'auto', height = 'auto', alt, align, object_fit, inline, node_key } = props
	const [x] = useState(() => container.resolve(Model))
	const [editor] = useLexicalComposerContext()
	const [selected, setSelected, clearSelection] = useLexicalNodeSelection(node_key!)
	const { t } = useTranslation()

	const style_wrap = {} as CSSProperties
	const style_img = {} as CSSProperties

	useLayoutEffect(() => {
		x.block.init(editor, node_key!, setSelected, clearSelection)

		return () => x.block.off()
	}, [editor, node_key, setSelected, clearSelection])

	useEffect(() => {
		x.block.selected = selected
	}, [selected])

	const onLoad = useMemoizedFn(() => {
		if (x.show_error) x.show_error = false
	})

	const onError = useMemoizedFn(() => {
		x.show_error = true
	})

	if (align) style_wrap['justifyContent'] = align
	if (object_fit) style_img['objectFit'] = object_fit

	if (inline)
		return (
			<img
				className={$cx('__editor_image', styles.inline, x.block.selected && styles.selected)}
				src={src}
				alt={alt}
				draggable={false}
				onClick={x.block.onClick}
			/>
		)

	return (
		<span className={$cx('flex w_100', styles.wrap, x.show_error && styles.show_error)} style={style_wrap}>
			<span className='__editor_image_wrap relative' style={{ width }}>
				<img
					className={$cx('__editor_image', styles._local, x.block.selected && styles.selected)}
					src={src}
					width={width}
					height={height === '100%' ? 'auto' : height}
					alt={alt}
					style={style_img}
					draggable={false}
					onClick={x.block.onClick}
					onLoad={onLoad}
					onError={onError}
				/>
				<If condition={x.show_error}>
					<div className='error_wrap w_100 flex justify_center align_center'>
						<ImageBroken size={36} weight='light'></ImageBroken>
					</div>
				</If>
				<input
					className={$cx('w_100 border_box', styles.alt)}
					autoComplete='off'
					defaultValue={alt}
					placeholder={t('editor.Image.modal.placeholder.alt')}
					maxLength={60}
					onKeyDown={stopPropagation}
					onBlur={x.onChangeAlt}
				></input>
				<span
					className={$cx(
						'options_wrap border_box none justify_between align_center absolute',
						styles.src_wrap
					)}
				>
					<input
						className='w_100 border_box'
						name='width'
						type='text'
						autoComplete='off'
						defaultValue={src}
						onKeyDown={stopPropagation}
						onBlur={x.onChangeSrc}
					/>
				</span>
				<span
					className={$cx(
						'options_wrap border_box none justify_between align_center absolute',
						styles.size_wrap
					)}
				>
					<span className='size_input_wrap flex align_center'>
						<span className='input_item flex align_center'>
							<label>W</label>
							<input
								className='border_box'
								name='width'
								type='text'
								maxLength={4}
								autoComplete='off'
								defaultValue={width || 'auto'}
								onKeyDown={stopPropagation}
								onBlur={({ target: { value } }) => x.onChangeSize('width', value)}
							/>
						</span>
						<span className='input_item flex align_center'>
							<label>H</label>
							<input
								className='border_box'
								name='height'
								type='text'
								maxLength={4}
								autoComplete='off'
								defaultValue={height || 'auto'}
								onKeyDown={stopPropagation}
								onBlur={({ target: { value } }) => x.onChangeSize('height', value)}
							/>
						</span>
					</span>
				</span>
				<span
					className={$cx(
						'options_wrap border_box none justify_between align_center absolute',
						styles.object_fit_wrap
					)}
				>
					<span
						className={$cx(
							'option_item flex justify_center align_center cursor_point clickable',
							object_fit === 'contain' && 'active'
						)}
						onClick={() => x.onChangeObjectFit('contain')}
					>
						<CornersIn></CornersIn>
					</span>
					<span
						className={$cx(
							'option_item flex justify_center align_center cursor_point clickable',
							object_fit === 'cover' && 'active'
						)}
						onClick={() => x.onChangeObjectFit('cover')}
					>
						<CornersOut></CornersOut>
					</span>
					<span
						className={$cx(
							'option_item flex justify_center align_center cursor_point clickable',
							object_fit === 'fill' && 'active'
						)}
						onClick={() => x.onChangeObjectFit('fill')}
					>
						<ArrowsOut></ArrowsOut>
					</span>
				</span>
				<span
					className={$cx(
						'options_wrap border_box none justify_between align_center absolute',
						styles.align_wrap
					)}
				>
					<span
						className={$cx(
							'option_item flex justify_center align_center cursor_point clickable',
							align === 'left' && 'active'
						)}
						onClick={() => x.onChangeAlign('left')}
					>
						<AlignLeftSimple></AlignLeftSimple>
					</span>
					<span
						className={$cx(
							'option_item flex justify_center align_center cursor_point clickable',
							align === 'center' && 'active'
						)}
						onClick={() => x.onChangeAlign('center')}
					>
						<AlignCenterHorizontalSimple></AlignCenterHorizontalSimple>
					</span>
					<span
						className={$cx(
							'option_item flex justify_center align_center cursor_point clickable',
							align === 'right' && 'active'
						)}
						onClick={() => x.onChangeAlign('right')}
					>
						<AlignRightSimple></AlignRightSimple>
					</span>
				</span>
				<span
					className={$cx(
						'options_wrap btn_single border_box none justify_center align_center absolute cursor_point clickable',
						styles.btn_reset
					)}
					onClick={x.onReset}
				>
					<ArrowCounterClockwise></ArrowCounterClockwise>
				</span>
				<span
					className={$cx(
						'options_wrap btn_single border_box none justify_center align_center absolute cursor_point clickable',
						styles.btn_remove
					)}
					onClick={e => {
						editor.update(() => {
							x.block.onDelete(e)
						})
					}}
				>
					<Trash></Trash>
				</span>
			</span>
		</span>
	)
}

export default new $app.handle(Index).by(observer).by($app.memo).get()
