import { Form, Input } from 'antd'
import { debounce } from 'lodash-es'
import { useEffect } from 'react'
import { useTranslation } from 'react-i18next'

import { IconEditor } from '@/components'
import { isFormValuesEqual } from '@/utils'

const { Item, useForm } = Form

import type { IPropsSettingsModal } from '../index'

const Index = (
	props: Pick<IPropsSettingsModal, 'module' | 'children' | 'info' | 'IconEditCenter' | 'onValuesChange'>
) => {
	const { module, children, info, IconEditCenter, onValuesChange } = props
	const [form] = useForm()
	const { t } = useTranslation()
	const { getFieldsValue, setFieldsValue } = form

	useEffect(() => {
		const target = { ...info, icon_info: { icon: info.icon, icon_hue: info.icon_hue } }

		if (isFormValuesEqual(getFieldsValue(), target)) return

		setFieldsValue(target)
	}, [info])

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
					<IconEditor module={module} center={IconEditCenter}></IconEditor>
				</Item>
				<Item className='name_item_wrap' name='name'>
					<Input
						className='name_input'
						placeholder={t('translation:components.SettingsModal.name_placeholder')}
						showCount
						maxLength={72}
					></Input>
				</Item>
			</div>
			{children}
		</Form>
	)
}

export default $app.memo(Index)
