import { useMemoizedFn } from 'ahooks'
import { Button, Form, Input, Switch } from 'antd'
import { $getNodeByKey } from 'lexical'
import { useTranslation } from 'react-i18next'

import Render from '@/Editor/plugins/Katex/Node/Render'
import { useCreateEffect } from '@/hooks'
import { useLexicalComposerContext } from '@lexical/react/LexicalComposerContext'
import { Function } from '@phosphor-icons/react'

import { INSERT_KATEX_COMMAND } from '../../commands'
import styles from './index.css'

import type { IPropsModal } from '../../types'
import type KatexNode from '@/Editor/plugins/Katex/Node'

const { Item, useForm, useWatch } = Form
const { TextArea } = Input

const Index = (props: IPropsModal) => {
	const { node_key, onClose } = props
	const [editor] = useLexicalComposerContext()
	const [form] = useForm()
	const { setFieldsValue } = form
	const { t } = useTranslation()
	const value = useWatch('value', form)
	const inline = useWatch('inline', form)

	useCreateEffect(() => {
		if (!node_key) return

		editor.getEditorState().read(() => {
			const node = $getNodeByKey(node_key) as KatexNode

			setFieldsValue({ value: node.__value, inline: node.__inline })
		})
	}, [node_key])

	const onFinish = useMemoizedFn(v => {
		const { value, inline } = v

		if (!value) return

		if (node_key) {
			editor.update(() => {
				const node = $getNodeByKey(node_key) as KatexNode
				const target = node.getWritable()

				target.__value = value
				target.__inline = inline
			})
		} else {
			editor.dispatchCommand(INSERT_KATEX_COMMAND, { value, inline })
		}

		onClose()
	})

	return (
		<div className={$cx('relative', styles._local)}>
			<Form form={form} preserve={false} layout='vertical' onFinish={onFinish}>
				<Item
					className='inline_wrap absolute'
					label={t('editor.Katex.modal.label.inline')}
					name='inline'
				>
					<Switch size='small'></Switch>
				</Item>
				<Item label={t('editor.Katex.modal.label.equation')} name='value'>
					<Choose>
						<When condition={inline}>
							<Input placeholder={t('editor.Katex.modal.placeholder.equation')}></Input>
						</When>
						<Otherwise>
							<TextArea
								autoSize={{ minRows: 2 }}
								placeholder={t('editor.Katex.modal.placeholder.equation')}
							></TextArea>
						</Otherwise>
					</Choose>
				</Item>
				<Item label={t('common.preview')}>
					<div className='prewview_wrap w_100 border_box flex justify_center align_center transition_normal'>
						<Choose>
							<When condition={value}>
								<Render value={value} inline={inline}></Render>
							</When>
							<Otherwise>
								<span className='preview'>
									<Function></Function>
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
