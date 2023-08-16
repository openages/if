import { Modal, Form, Input, theme, Select } from 'antd'
import { nanoid } from 'nanoid'
import { useMemo } from 'react'
import { useTranslation } from 'react-i18next'

import { useLimits } from '@/hooks'

import { IconEditor, AnglesEditor, TagsEditor } from './components'
import styles from './index.css'

import type { IPropsSettingsModal } from '../../types'

const { Item, useForm } = Form
const { TextArea } = Input
const { useToken } = theme

const Index = (props: IPropsSettingsModal) => {
	const { visible_settings_modal, info, closeSettingsModal } = props
	const [form] = useForm()
	const limits = useLimits()
	const { token } = useToken()
	const { t, i18n } = useTranslation()

	const auto_archiving_options = useMemo(() => {
		// @ts-ignore
		const locale_options = t('translation:todo.Header.settings.auto_archiving', {
			returnObjects: true
		}) as Record<string, string>

		return Object.keys(locale_options).map((key) => ({
			label: locale_options[key],
			value: key
		}))
	}, [i18n.language])

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
						? info?.tags?.map((item) => ({
								id: nanoid(),
								color: item.color,
								text: item.text
						  }))
						: [{ id: nanoid(), color: '' || token.colorPrimary, text: '' }]
				}}
			>
				<div className='flex justify_between'>
					<Item name='icon'>
						<IconEditor></IconEditor>
					</Item>
					<Item className='name_item_wrap' name='name'>
						<Input
							className='name_input'
							placeholder='请输入名称'
							showCount
							maxLength={limits.todo_list_title_max_length}
						></Input>
					</Item>
				</div>
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
				<Item name={['settings', 'auto_archiving']} label='自动归档'>
					<Select options={auto_archiving_options}></Select>
				</Item>
			</Form>
		</Modal>
	)
}

export default $app.memo(Index)
