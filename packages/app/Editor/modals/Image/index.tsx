import { Button, Form, Input, Segmented } from 'antd'
import { observer } from 'mobx-react-lite'
import { useState } from 'react'

import { FileUploader } from '@/components'

import styles from './index.css'
import Model from './model'
import options from './options'

const { Item, useForm } = Form

const Index = () => {
	const [x] = useState(() => new Model())

	return (
		<div className={$cx(styles._local)}>
			<Segmented className='w_100' block options={options} onChange={x.onChangeType}></Segmented>
			<Form
				layout='vertical'
				onValuesChange={v => {
					console.log(v)
				}}
			>
				<Choose>
					<When condition={x.type === 'URL'}>
						<Item label='URL' name='url'>
							<Input placeholder='Image URL'></Input>
						</Item>
					</When>
					<When condition={x.type === 'File'}>
						<Item label='File' name='file'>
							<FileUploader accept='image/*' maxCount={1} maxSize={1}></FileUploader>
						</Item>
					</When>
				</Choose>
				<Item label='Alt' name='alt'>
					<Input placeholder='Image Alt Text'></Input>
				</Item>
				<Button className='w_100 mt_4' htmlType='submit' type='primary'>
					Confirm
				</Button>
			</Form>
		</div>
	)
}

export default new $app.handle(Index).by(observer).by($app.memo).get()
