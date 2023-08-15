import { useEventTarget, useKeyPress, useMemoizedFn, useDeepCompareEffect } from 'ahooks'
import { Input, Modal, Popover } from 'antd'
import { useEffect, useState, useMemo, useRef } from 'react'
import { useTranslation } from 'react-i18next'
import { Else, If, Then } from 'react-if'
import { match } from 'ts-pattern'

import { EmojiPicker } from '@/components'
import { useLimits } from '@/hooks'

import LeftIcon from '../LeftIcon'
import styles from './index.css'

import type { IPropsModal } from '../../types'
import type { DirTree } from '@/types'
import type { InputRef } from 'antd'

const Index = (props: IPropsModal) => {
	const {
		module,
		modal_open,
		modal_type,
		current_option,
		focusing_item,
		loading_add,
		loading_rename,
		add,
		setModalOpen,
		resetFocusingItem,
		rename
	} = props
	const [icon, setIcon] = useState('')
	const input = useRef<InputRef>(null)
	const [value, { onChange }] = useEventTarget<string>()
	const limits = useLimits()
	const { t } = useTranslation()

	useEffect(() => {
		if (modal_open) return input.current?.focus?.()

		setIcon('')
		onChange({ target: { value: '' } })
	}, [modal_open])

	useDeepCompareEffect(() => {
		if (focusing_item.icon && current_option === 'rename') {
			setIcon(focusing_item.icon)
		}

		if (focusing_item.id && current_option === 'rename') {
			onChange({ target: { value: focusing_item.name } })
		}
	}, [focusing_item, current_option])

	useKeyPress('enter', () => onOk())

	const title = useMemo(() => {
		if (!current_option || !focusing_item.id)
			return t('translation:dirtree.add') + t(`translation:dirtree.${modal_type}`)

		return match(current_option)
			.with(
				'add_file',
				() => focusing_item.name + ' / ' + t('translation:dirtree.add') + t('translation:dirtree.file')
			)
			.with(
				'add_dir',
				() => focusing_item.name + ' / ' + t('translation:dirtree.add') + t('translation:dirtree.dir')
			)
			.with(
				'rename',
				() => t('translation:dirtree.options.rename') + t(`translation:dirtree.${focusing_item.type}`)
			)
			.exhaustive()
	}, [modal_type, current_option, focusing_item])

	const left_icon_item = useMemo(() => {
		if (current_option === 'add_file') return { type: 'file' } as DirTree.Item
		if (current_option === 'add_dir') return { type: 'dir' } as DirTree.Item
		if (focusing_item.id) return focusing_item

		return { type: modal_type } as DirTree.Item
	}, [modal_type, current_option, focusing_item])

	const onOk = useMemoizedFn(() => {
		if (!value || value.length > limits.todo_list_title_max_length) return
		if (current_option === 'rename') return rename(value, icon)
		if (current_option === 'add_file') return add('file', value, icon)
		if (current_option === 'add_dir') return add('dir', value, icon)

		add(modal_type, value, icon)
	})

	const onSelectIcon = useMemoizedFn(({ shortcodes }) => setIcon(shortcodes))

	return (
		<Modal
			wrapClassName={styles._local}
			open={modal_open}
			title={title}
			width={300}
			confirmLoading={loading_add || loading_rename}
			centered
			destroyOnClose
			onOk={onOk}
			onCancel={() => {
				setModalOpen(false)
				resetFocusingItem()
			}}
		>
			<div className='w_100 flex align_center justify_between'>
				<Popover
					rootClassName={styles.icon_picker}
					placement='left'
					trigger='click'
					align={{ offset: [-30, 0] }}
					content={<EmojiPicker onEmojiSelect={onSelectIcon} />}
				>
					<div className='icon_wrap flex justify_center align_center clickable'>
						<If condition={icon}>
							<Then>
								<em-emoji shortcodes={icon} size='24px'></em-emoji>
							</Then>
							<Else>
								<LeftIcon module={module} item={left_icon_item}></LeftIcon>
							</Else>
						</If>
					</div>
				</Popover>
				<Input
					placeholder={t('translation:dirtree.input_placeholder')}
					showCount
					autoFocus
					ref={input}
					value={value}
					maxLength={limits.todo_list_title_max_length}
					onChange={onChange}
				></Input>
			</div>
		</Modal>
	)
}

export default $app.memo(Index)
