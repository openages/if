import { useEventTarget } from 'ahooks'
import { Input, Modal } from 'antd'
import { useMemo } from 'react'
import { match } from 'ts-pattern'

import { useLimits, useLocale } from '@/hooks'

import styles from './index.css'

import type { IPropsModal } from '../../types'

const Index = (props: IPropsModal) => {
	const { modal_open, modal_type, add, setModalOpen } = props
	const [value, { onChange }] = useEventTarget<string>()
	const limits = useLimits()
	const l = useLocale()

	const title = useMemo(
		() =>
			match(modal_type)
				.with('file', () => l('dirtree.file'))
				.with('dir', () => l('dirtree.dir'))
				.exhaustive(),
		[modal_type]
	)

	const onOk = () => {
		if (!value || value.length > limits.todo_list_title_max_length) return

		add(modal_type, value)
	}

	return (
		<Modal
			wrapClassName={styles._local}
			open={modal_open}
			title={l('dirtree.add') + title}
			centered
			width={270}
			onOk={onOk}
			onCancel={() => setModalOpen(false)}
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
