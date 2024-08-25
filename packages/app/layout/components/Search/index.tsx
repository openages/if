import { useEventListener, useFocusWithin, useMemoizedFn } from 'ahooks'
import { debounce } from 'lodash-es'
import { useEffect, useRef, useState, Fragment } from 'react'
import { useTranslation } from 'react-i18next'

import { LazyElement, Modal, SimpleEmpty } from '@/components'
import { ArrowBendDownLeft, ArrowDown, ArrowUp, MagnifyingGlass, Trash, X } from '@phosphor-icons/react'

import styles from './index.css'

import type { IPropsSearch } from '@/layout/types'
import type { KeyboardEvent, MouseEvent } from 'react'

const Index = (props: IPropsSearch) => {
	const {
		open,
		module,
		items,
		index,
		history,
		searchByInput,
		onClose,
		onCheck,
		changeSearchIndex,
		clearSearchHistory
	} = props
	const { t } = useTranslation()
	const ref = useRef(null)
	const focusing = useFocusWithin(ref)
	const [compositing, setCompositing] = useState(false)
	const [text, setText] = useState('')

	useEventListener('compositionstart', () => setCompositing(true), { target: ref })

	useEventListener(
		'compositionend',
		() => {
			setCompositing(false)
			searchByInput(ref.current?.value)
			setText(ref.current?.value)
		},
		{ target: ref }
	)

	const handleChangeIndex = useMemoizedFn(e => {
		const event = e as KeyboardEvent

		if (event.key === 'Enter') {
			event.preventDefault()

			const target = items[index]

			if (!target) return

			onCheck({ id: target.item.id, file: target.file })
		}

		if (event.key === 'Escape') {
			event.preventDefault()
			onClose()
		}

		if (event.key === 'ArrowUp') {
			event.preventDefault()
			changeSearchIndex(index - 1)
		}

		if (event.key === 'ArrowDown') {
			event.preventDefault()
			changeSearchIndex(index + 1)
		}
	})

	useEffect(() => {
		if (!open) return

		document.addEventListener('keydown', handleChangeIndex)

		return () => document.removeEventListener('keydown', handleChangeIndex)
	}, [open])

	const onInput = useMemoizedFn(
		debounce(({ target: { value } }) => {
			if (compositing) return

			searchByInput(value)
			setText(value)
		}, 600)
	)

	const clear = useMemoizedFn(() => {
		ref.current!.value = ''

		searchByInput('')
		setText('')
	})

	const onSearchItem = useMemoizedFn((e: MouseEvent<HTMLDivElement>) => {
		const target = e.target as HTMLDivElement
		const text = target.getAttribute('data-text')

		if (!text) return

		ref.current!.value = text

		searchByInput(text)
		setText(text)
	})

	return (
		<Modal
			bodyClassName={styles._local}
			maskClosable
			disableOverflow
			width={420}
			open={open}
			onCancel={onClose}
		>
			<div className='flex flex_column'>
				<div className='input_wrap w_100 relative flex align_center'>
					<MagnifyingGlass
						className={$cx('icon_search absolute transition_normal', focusing && 'focusing')}
						size={18}
					></MagnifyingGlass>
					<input
						type='text'
						className='input_search w_100 border_box'
						placeholder={`${t('dirtree.search_placeholder')}${t(
							`translation:modules.${module}`
						)}`}
						autoFocus
						maxLength={30}
						ref={ref}
						onInput={onInput}
					/>
					{text && (
						<div
							className='btn_clear flex justify_center align_center absolute clickable'
							onClick={clear}
						>
							<X size={15}></X>
						</div>
					)}
				</div>
				<div className='search_items_wrap w_100 border_box flex flex_column'>
					{items.length > 0 ? (
						items.map(({ item, file, setting }, idx) => (
							<LazyElement
								type='search'
								path={module}
								props={{
									item,
									file,
									setting,
									text,
									active: idx === index,
									index: idx,
									changeSearchIndex,
									onCheck
								}}
								key={item.id}
							></LazyElement>
						))
					) : (
						<Fragment>
							{history.length > 0 && (
								<div className='search_history w_100 flex flex_column'>
									<div className='search_history_header flex justify_between align_center'>
										<span className='title'>{t('app.search.history')}</span>
										<div
											className='btn_clear flex justify_center align_center clickable'
											onClick={clearSearchHistory}
										>
											<Trash size={14}></Trash>
										</div>
									</div>
									<div className='flex flex_wrap' onClick={onSearchItem}>
										{history.map((item, index) => (
											<span
												className='search_history_item mr_4 cursor_point clickable'
												data-text={item}
												key={index}
											>
												{item}
											</span>
										))}
									</div>
								</div>
							)}
							<SimpleEmpty style={{ height: 300 }}></SimpleEmpty>
						</Fragment>
					)}
				</div>
				<div className='hotkey_wrap w_100 border_box flex justify_between align_center'>
					<div className='flex align_center'>
						<div className='key_item flex align_center mr_18'>
							<div className='icon_key_wrap border_box flex justify_center align_center'>
								<ArrowUp></ArrowUp>
							</div>
							<div className='icon_key_wrap border_box flex justify_center align_center'>
								<ArrowDown></ArrowDown>
							</div>
							<span className='desc'>{t('app.search.to_navigate')}</span>
						</div>
						<div className='key_item flex align_center'>
							<div className='icon_key_wrap border_box flex justify_center align_center'>
								<ArrowBendDownLeft></ArrowBendDownLeft>
							</div>
							<span className='desc'>{t('app.search.to_select')}</span>
						</div>
					</div>
					<div className='flex align_center'>
						<div className='key_item flex align_center'>
							<div className='icon_key_wrap esc_wrap border_box flex justify_center align_center'>
								<span className='esc'>esc</span>
							</div>
							<span className='desc'>{t('app.search.to_close')}</span>
						</div>
					</div>
				</div>
			</div>
		</Modal>
	)
}

export default $app.memo(Index)
