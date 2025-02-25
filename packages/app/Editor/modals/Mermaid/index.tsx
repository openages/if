import { useMemoizedFn } from 'ahooks'
import { Button, Form, Input } from 'antd'
import { $getNodeByKey } from 'lexical'
import { useTranslation } from 'react-i18next'

import Render from '@/Editor/plugins/Mermaid/Node/Render'
import { useCreateEffect } from '@/hooks'
import { useLexicalComposerContext } from '@lexical/react/LexicalComposerContext'
import { TreeStructure } from '@phosphor-icons/react'

import { INSERT_MERMAID_COMMAND } from '../../commands'
import styles from './index.css'

import type { IPropsModal } from '../../types'
import type MermaidNode from '@/Editor/plugins/Mermaid/Node'

const { Item, useForm, useWatch } = Form
const { TextArea } = Input

const Index = (props: IPropsModal) => {
	const { node_key, onClose } = props
	const [editor] = useLexicalComposerContext()
	const [form] = useForm()
	const { setFieldsValue } = form
	const { t } = useTranslation()
	const value = useWatch('value', form)

	useCreateEffect(() => {
		if (!node_key) return

		editor.getEditorState().read(() => {
			const node = $getNodeByKey(node_key) as MermaidNode

			setFieldsValue({ value: node.__value })
		})
	}, [node_key])

	const onFinish = useMemoizedFn(v => {
		const { value } = v

		if (!value) return

		if (node_key) {
			editor.update(() => {
				const node = $getNodeByKey(node_key) as MermaidNode
				const target = node.getWritable()

				target.__value = value
			})
		} else {
			editor.dispatchCommand(INSERT_MERMAID_COMMAND, { value })
		}

		onClose()
	})

	return (
		<div className={$cx('relative', styles._local)}>
			<Form form={form} preserve={false} layout='vertical' onFinish={onFinish}>
				<Item label={t('editor.Mermaid.modal.label.definition')} name='value'>
					<TextArea
						autoSize={{ minRows: 3 }}
						placeholder={t('editor.Mermaid.modal.placeholder')}
					></TextArea>
				</Item>
				<Item label={t('common.preview')}>
					<div className='prewview_wrap w_100 border_box flex justify_center align_center transition_normal'>
						<Choose>
							<When condition={value}>
								<Render value={value}></Render>
							</When>
							<Otherwise>
								<span className='preview'>
									<TreeStructure></TreeStructure>
								</span>
							</Otherwise>
						</Choose>
					</div>
				</Item>
				<Button className='w_100 mt_4' htmlType='submit' type='primary'>
					{t('common.confirm')}
				</Button>
			</Form>
		</div>
	)
}

export default $app.memo(Index)
