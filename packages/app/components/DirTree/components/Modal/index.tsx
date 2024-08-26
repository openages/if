import { useDeepCompareEffect, useEventTarget, useKeyPress, useMemoizedFn } from 'ahooks'
import { Input, Modal } from 'antd'
import { useEffect, useMemo, useRef, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { match } from 'ts-pattern'

import { IconEditor } from '@/components'

import styles from './index.css'

import type { DirTree } from '@/types'
import type { InputRef } from 'antd'
import type { IPropsModal } from '../../types'

const Index = (props: IPropsModal) => {
	const {
		module,
		modal_open,
		modal_type,
		current_option,
		focusing_item,
		loading_create,
		loading_updateItem,
		insert,
		update,
		setModalOpen,
		resetFocusingItem
	} = props
	const [icon, setIcon] = useState({ icon: '', icon_hue: undefined })
	const input = useRef<InputRef>(null)
	const [value, { onChange }] = useEventTarget<string>()
	const { t } = useTranslation()

	useEffect(() => {
		if (modal_open) return input.current?.focus?.()

		setIcon({ icon: '', icon_hue: undefined })
		onChange({ target: { value: '' } })
	}, [modal_open])

	useDeepCompareEffect(() => {
		if (focusing_item.icon && current_option === 'rename') {
			setIcon({ icon: focusing_item.icon, icon_hue: focusing_item.icon_hue })
		}

		if (focusing_item.id && current_option === 'rename') {
			onChange({ target: { value: focusing_item.name } })
		}
	}, [focusing_item, current_option])

	useKeyPress('enter', () => onOk())

	const title = useMemo(() => {
		if (!current_option || !focusing_item.id) return t('dirtree.add') + t(`dirtree.${modal_type}`)

		return match(current_option)
			.with('add_file', () => focusing_item.name + ' / ' + t('dirtree.add') + t('dirtree.file'))
			.with('add_dir', () => focusing_item.name + ' / ' + t('dirtree.add') + t('dirtree.dir'))
			.with('rename', () => t('dirtree.options.rename') + t(`dirtree.${focusing_item.type}`))
			.exhaustive()
	}, [modal_type, current_option, focusing_item])

	const left_icon_item = useMemo(() => {
		if (current_option === 'add_file') return { type: 'file' } as DirTree.Item
		if (current_option === 'add_dir') return { type: 'dir' } as DirTree.Item
		if (focusing_item.id) return focusing_item

		return { type: modal_type } as DirTree.Item
	}, [modal_type, current_option, focusing_item])

	const onOk = useMemoizedFn(() => {
		if (!value || value.length > 72) return
		if (current_option === 'rename') return update({ name: value, ...icon })
		if (current_option === 'add_dir') return insert({ type: 'dir', name: value, ...icon })
		if (current_option === 'add_file') return insert({ type: 'file', name: value, ...icon })

		insert({ type: modal_type, name: value, ...icon })
	})

	const onSelectIcon = useMemoizedFn(shortcodes => setIcon(shortcodes))
	const onCancel = useMemoizedFn(() => setModalOpen(false))
	const afterClose = useMemoizedFn(() => resetFocusingItem())

	return (
		<Modal
			wrapClassName={styles._local}
			open={modal_open}
			title={title}
			width={300}
			zIndex={10000}
			confirmLoading={loading_create || loading_updateItem}
			centered
			destroyOnClose
			maskClosable={false}
			onOk={onOk}
			onCancel={onCancel}
			afterClose={afterClose}
		>
			<div className='w_100 flex align_center justify_between'>
				<IconEditor
					module={module}
					value={icon}
					left_icon_item={left_icon_item}
					center
					onChange={onSelectIcon}
				></IconEditor>
				<Input
					placeholder={t('dirtree.input_placeholder')}
					showCount
					autoFocus
					ref={input}
					value={value}
					maxLength={72}
					onChange={onChange}
				></Input>
			</div>
		</Modal>
	)
}

export default $app.memo(Index)
