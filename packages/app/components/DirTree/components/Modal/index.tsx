import { useEventTarget } from 'ahooks'
import { Input, Modal } from 'antd'
import { useEffect, useMemo } from 'react'
import { match } from 'ts-pattern'

import { useLimits, useLocale } from '@/hooks'

import styles from './index.css'

import type { IPropsModal } from '../../types'

const Index = (props: IPropsModal) => {
	const { modal_open, modal_type, focusing_item, add, setModalOpen, resetFocusingItem, rename } = props
	const [value, { onChange }] = useEventTarget<string>()
	const limits = useLimits()
	const l = useLocale()

	const title = useMemo(
		() =>
			match(focusing_item.type ?? modal_type)
				.with('file', () => l('dirtree.file'))
				.with('dir', () => l('dirtree.dir'))
				.exhaustive(),
		[modal_type, focusing_item]
	)

	useEffect(() => {
		if (!modal_open) onChange({ target: { value: '' } })
	}, [modal_open])

	const onOk = () => {
		if (!value || value.length > limits.todo_list_title_max_length) return
		if (focusing_item.id) return rename(value)

		add(modal_type, value)
	}

	return (
		<Modal
			wrapClassName={styles._local}
			open={modal_open}
			title={focusing_item.id ? l('dirtree.options.rename') + focusing_item.name : l('dirtree.add') + title}
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
