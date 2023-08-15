import { Modal, Form, Input } from 'antd'
import { nanoid } from 'nanoid'

import { useLimits } from '@/hooks'

import { AnglesEditor, TagsEditor } from './components'
import styles from './index.css'

import type { IPropsSettingsModal } from '../../types'

const { Item, useForm } = Form
const { TextArea } = Input

const Index = (props: IPropsSettingsModal) => {
	const { visible_settings_modal, info, closeSettingsModal } = props
	const [form] = useForm()
	const limits = useLimits()

	return (
		<Modal
			rootClassName={styles._local}
			open={visible_settings_modal}
			title={`编辑${info.name}`}
			width={360}
			centered
			destroyOnClose
			maskClosable={false}
			onCancel={closeSettingsModal}
		>
			<Form
				className='form_wrap'
				form={form}
				layout='vertical'
				preserve={false}
				initialValues={{
					...info,
					angles: info?.angles?.length
						? info?.angles?.map((item) => ({ id: nanoid(), text: item }))
						: [{ id: nanoid(), text: '' }],
					tags: info?.tags?.length
						? info?.tags?.map((item) => ({ id: nanoid(), text: item }))
						: [{ id: nanoid(), text: '' }]
				}}
			>
				<Item name='name'>
					<Input
						className='name_input'
						placeholder='请输入名称'
						showCount
						maxLength={limits.todo_list_title_max_length}
					></Input>
				</Item>
				<Item name='desc' label='简介'>
					<TextArea
						className='desc_textarea'
						placeholder='请输入简介'
						rows={3}
						showCount
						maxLength={limits.todo_list_desc_max_length}
					></TextArea>
				</Item>
				<Item name='angles' label='分类'>
					<AnglesEditor></AnglesEditor>
				</Item>
				<Item name='tags' label='标签'>
					<TagsEditor></TagsEditor>
				</Item>
			</Form>
		</Modal>
	)
}

export default $app.memo(Index)
