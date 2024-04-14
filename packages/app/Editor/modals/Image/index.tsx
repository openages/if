import { useMemoizedFn } from 'ahooks'
import { Button, Form, Input, Segmented } from 'antd'
import { observer } from 'mobx-react-lite'
import { useState } from 'react'
import { useTranslation } from 'react-i18next'

import { FileUploader } from '@/components'
import { MAX_SIZE } from '@/Editor/plugins/Image/const'
import { useLexicalComposerContext } from '@lexical/react/LexicalComposerContext'

import { INSERT_IMAGE_COMMAND } from '../../commands'
import { getFileAlt } from '../../utils'
import styles from './index.css'
import Model from './model'
import options from './options'

import type { IPropsModal } from '../../types'
import type { UploadProps } from 'antd'

const { Item, useForm } = Form

const Index = (props: IPropsModal) => {
	const { onClose } = props
	const [x] = useState(() => new Model())
	const [editor] = useLexicalComposerContext()
	const [form] = useForm()
	const { t } = useTranslation()
	const { setFieldsValue } = form

	const onValuesChange = useMemoizedFn(v => {
		if (v.file?.length !== 1) return

		const file = (v.file as UploadProps['fileList'])[0]

		if (file.status !== 'done') return

		setFieldsValue({ alt: getFileAlt(file.name) })
	})

	const onFinish = useMemoizedFn(v => {
		if (x.type === 'URL' && !v.src) return
		if (x.type === 'File' && v.file?.length !== 1) return

		const target = { alt: v.alt, src: v.src }

		if (x.type === 'File') {
			const file = (v.file as UploadProps['fileList'])[0]

			target['src'] = file.response

			if (!v.alt) target['alt'] = file.name
		}

		editor.dispatchCommand(INSERT_IMAGE_COMMAND, target)

		onClose()
	})

	return (
		<div className={$cx(styles._local)}>
			<Segmented className='w_100' block options={options} onChange={x.onChangeType}></Segmented>
			<Form
				form={form}
				preserve={false}
				layout='vertical'
				onValuesChange={onValuesChange}
				onFinish={onFinish}
			>
				<Choose>
					<When condition={x.type === 'URL'}>
						<Item label='URL' name='src'>
							<Input
								placeholder={t('translation:editor.Image.modal.placeholder.url')}
							></Input>
						</Item>
					</When>
					<When condition={x.type === 'File'}>
						<Item label='File' name='file'>
							<FileUploader accept='image/*' maxCount={1} maxSize={MAX_SIZE}></FileUploader>
						</Item>
					</When>
				</Choose>
				<Item label='Alt' name='alt'>
					<Input placeholder={t('translation:editor.Image.modal.placeholder.alt')}></Input>
				</Item>
				<Button className='w_100 mt_4' htmlType='submit' type='primary'>
					{t('translation:common.confirm')}
				</Button>
			</Form>
		</div>
	)
}

export default new $app.handle(Index).by(observer).by($app.memo).get()
