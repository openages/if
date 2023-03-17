import { useEventTarget } from 'ahooks'
import { Input, Modal } from 'antd'
import { useEffect, useMemo } from 'react'
import { match } from 'ts-pattern'

import { useLimits, useLocale } from '@/hooks'

import styles from './index.css'

import type { IPropsModal } from '../../types'

const Index = (props: IPropsModal) => {
	const { modal_open, modal_type, current_option, focusing_item, add, setModalOpen, resetFocusingItem, rename } =
		props
	const [value, { onChange }] = useEventTarget<string>()
	const limits = useLimits()
	const l = useLocale()

	const title = useMemo(() => {
		if (!current_option) return l('dirtree.add') + l(`dirtree.${modal_type}`)

		if (!focusing_item.id) return ''

		return match(current_option)
			.with('add', () => focusing_item.name + '|' + l('dirtree.add') + l('dirtree.file'))
			.with('rename', () => l('dirtree.options.rename') + l(`dirtree.${focusing_item.type}`))
			.exhaustive()
	}, [modal_type, current_option, focusing_item])

	useEffect(() => {
		if (!modal_open) onChange({ target: { value: '' } })
	}, [modal_open])

	const onOk = () => {
		if (!value || value.length > limits.todo_list_title_max_length) return
		if (current_option === 'rename') return rename(value)
		if (current_option === 'add') return add(modal_type, value, true)

		add(modal_type, value)
	}

	return (
		<Modal
			wrapClassName={styles._local}
			open={modal_open}
			title={title}
			centered
			width={270}
			onOk={onOk}
			onCancel={() => {
				setModalOpen(false)
				resetFocusingItem()
			}}
		>
			<Input
				className='input_title w_100 border_box'
				placeholder={l('dirtree.input_placeholder', { values: { target: title } })}
				showCount
				value={value}
				maxLength={limits.todo_list_title_max_length}
				onChange={onChange}
			></Input>
		</Modal>
	)
}

export default $app.memo(Index)
