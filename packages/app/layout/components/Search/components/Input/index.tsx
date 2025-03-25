import { useClickAway, useEventListener, useFocusWithin, useMemoizedFn, useToggle } from 'ahooks'
import { debounce } from 'lodash-es'
import { useEffect, useImperativeHandle, useRef, useState } from 'react'
import { useTranslation } from 'react-i18next'

import { apps_home_drawer } from '@/appdata'
import { ModuleIcon, Show } from '@/components'
import { X } from '@phosphor-icons/react'

import styles from './index.css'

import type { IPropsSearchInput } from '@/layout/types'
import type { KeyboardEvent } from 'react'

const Index = (props: IPropsSearchInput) => {
	const {
		className,
		search_ref,
		module,
		items,
		index,
		setModule,
		searchByInput,
		onClose,
		onCheck,
		changeSearchIndex,
		showResult
	} = props
	const { t } = useTranslation()
	const ref = useRef<HTMLInputElement>(null)
	const ref_btn = useRef<HTMLDivElement>(null)
	const ref_select = useRef<HTMLDivElement>(null)
	const focusing = useFocusWithin(ref)
	const [compositing, setCompositing] = useState(false)
	const [text, setText] = useState('')
	const [visible, { toggle, set }] = useToggle()

	useEventListener('compositionstart', () => setCompositing(true), { target: ref })

	useEventListener(
		'compositionend',
		() => {
			setCompositing(false)
			searchByInput(ref.current?.value!)
			setText(ref.current?.value!)
			showResult?.()

			if (visible) toggle()
		},
		{ target: ref }
	)

	useClickAway(() => set(false), [ref_btn, ref_select])

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
			showResult?.()

			if (visible) toggle()
		}, 600)
	)

	const clear = useMemoizedFn(() => {
		ref.current!.value = ''

		searchByInput('')
		setText('')
	})

	useImperativeHandle(search_ref, () => ({
		text,
		input: ref.current!,
		setText
	}))

	return (
		<div className={$cx('input_wrap w_100 relative flex align_center relative', styles._local, className)}>
			<div
				className='icon_search flex justify_center align_center absolute clickable'
				ref={ref_btn}
				onClick={toggle}
			>
				<ModuleIcon
					className={$cx('icon transition_normal', (focusing || visible) && 'focusing')}
					type={module}
				></ModuleIcon>
			</div>
			<input
				type='text'
				className='input_search w_100 border_box'
				placeholder={`${t('dirtree.search_placeholder')}${t(`modules.${module}`)}`}
				autoFocus
				maxLength={30}
				ref={ref}
				onInput={onInput}
			/>
			{text && (
				<div className='btn_clear flex justify_center align_center absolute clickable' onClick={clear}>
					<X size={15}></X>
				</div>
			)}
			<Show className='select_wrap w_100 absolute left_0 flex' visible={visible} dom_ref={ref_select}>
				{apps_home_drawer.map(item => (
					<div
						className={$cx(
							'app_item flex flex_column align_center cursor_point',
							module === item && 'active'
						)}
						onClick={() => {
							toggle()
							clear()
							ref.current?.focus()

							setModule(item)
						}}
						key={item}
					>
						<ModuleIcon type={item}></ModuleIcon>
						<span className='name'>{t(`modules.${item}`)}</span>
					</div>
				))}
			</Show>
		</div>
	)
}

export default $app.memo(Index)
