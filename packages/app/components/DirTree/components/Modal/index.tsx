import { useEventTarget } from 'ahooks'
import { Input, Modal } from 'antd'
import { useMemo } from 'react'
import { match } from 'ts-pattern'

import { useLimits } from '@/hooks'

import styles from './index.css'

import type { IPropsModal } from '../../types'

const Index = (props: IPropsModal) => {
	const { modal_open, modal_type, add, setModalOpen } = props
	const [value, { onChange }] = useEventTarget<string>()
	const limits = useLimits()

	const title = useMemo(
		() =>
			match(modal_type)
				.with('file', () => '列表')
				.with('dir', () => '组')
				.exhaustive(),
		[modal_type]
	)

	const onOk = () => {
		if (!value) return
		if (value.length > limits.todo_list_title_max_length) {
			return $message.warning(`${title}名称不能超过${limits.todo_list_title_max_length}个字`)
		}

		add(modal_type, value)
	}

	return (
		<Modal
			wrapClassName={styles._local}
			open={modal_open}
			title={'新建' + title}
			centered
			width={270}
			onOk={onOk}
			onCancel={() => setModalOpen(false)}
		>
			<Input
				className='input_title w_100 border_box'
				placeholder={`请输入${title}名称`}
				showCount
				value={value}
				maxLength={limits.todo_list_title_max_length}
				onChange={onChange}
			></Input>
		</Modal>
	)
}

export default $app.memo(Index)
