import { useEventTarget, useKeyPress } from 'ahooks'
import { Input, Modal } from 'antd'
import { useEffect, useMemo } from 'react'
import { match } from 'ts-pattern'

import { useLimits, useLocale } from '@/hooks'

import styles from './index.css'

import type { IPropsModal } from '../../types'

const Index = (props: IPropsModal) => {
	const {
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
	const [value, { onChange }] = useEventTarget<string>()
	const limits = useLimits()
	const l = useLocale()

	useEffect(() => {
		if (!modal_open) onChange({ target: { value: '' } })
	}, [modal_open])

	useKeyPress('enter', () => onOk())

	const title = useMemo(() => {
		if (!current_option || !focusing_item.id) return l('dirtree.add') + l(`dirtree.${modal_type}`)

		return match(current_option)
			.with('add_file', () => focusing_item.name + ' / ' + l('dirtree.add') + l('dirtree.file'))
			.with('add_dir', () => focusing_item.name + ' / ' + l('dirtree.add') + l('dirtree.dir'))
			.with('rename', () => l('dirtree.options.rename') + l(`dirtree.${focusing_item.type}`))
			.exhaustive()
	}, [modal_type, current_option, focusing_item])

	const onOk = () => {
		if (!value || value.length > limits.todo_list_title_max_length) return
		if (current_option === 'rename') return rename(value)
		if (current_option === 'add_file') return add('file', value)
		if (current_option === 'add_dir') return add('dir', value)

		add(modal_type, value)
	}

	return (
		<Modal
			wrapClassName={styles._local}
			open={modal_open}
			title={title}
			centered
			width={270}
			confirmLoading={loading_add || loading_rename}
			onOk={onOk}
			onCancel={() => {
				setModalOpen(false)
				resetFocusingItem()
			}}
		>
			<Input
				className='input_title w_100 border_box'
				placeholder={l('dirtree.input_placeholder')}
				showCount
				value={value}
				maxLength={limits.todo_list_title_max_length}
				onChange={onChange}
			></Input>
		</Modal>
	)
}

export default $app.memo(Index)
