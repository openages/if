import { Form, Input } from 'antd'
import { debounce } from 'lodash-es'
import { useEffect } from 'react'
import { useTranslation } from 'react-i18next'

import { IconEditor } from '@/components'
import { useLimits } from '@/hooks'

const { Item, useForm } = Form

import type { IPropsSettingsModal } from '../index'

const Index = (props: Pick<IPropsSettingsModal, 'children' | 'info' | 'IconEditCenter' | 'onValuesChange'>) => {
	const { children, info, IconEditCenter, onValuesChange } = props
	const [form] = useForm()
	const limits = useLimits()
	const { t } = useTranslation()
	const { setFieldsValue } = form

	useEffect(() => setFieldsValue({ ...info, icon_info: { icon: info.icon, icon_hue: info.icon_hue } }), [info])

	return (
		<Form
			className='form_wrap'
			form={form}
			layout='vertical'
			preserve={false}
			onValuesChange={debounce(onValuesChange, 450, { leading: false })}
		>
			<div className='flex justify_between'>
				<Item name='icon_info'>
					<IconEditor center={IconEditCenter}></IconEditor>
				</Item>
				<Item className='name_item_wrap' name='name'>
					<Input
						className='name_input'
						placeholder={t('translation:components.SettingsModal.name_placeholder')}
						showCount
						maxLength={limits.todo_list_title_max_length}
					></Input>
				</Item>
			</div>
			{children}
		</Form>
	)
}

export default $app.memo(Index)
