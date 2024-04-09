import { useMemoizedFn } from 'ahooks'
import { Upload } from 'antd'
import { useTranslation } from 'react-i18next'

import { fileToBase64 } from '@/utils'
import { UploadSimple } from '@phosphor-icons/react'

import styles from './index.css'

import type { UploadProps } from 'antd'

const { Dragger } = Upload

interface IProps {
	value?: UploadProps['fileList']
	accept?: UploadProps['accept']
	multiple?: UploadProps['multiple']
	maxCount?: UploadProps['maxCount']
	showProgress?: boolean
	onChange?: (v: UploadProps['fileList']) => void
}

const Index = (props: IProps) => {
	const { value, accept, multiple, maxCount, showProgress, onChange } = props
	const { t } = useTranslation()

	const props_dragger: UploadProps = {
		fileList: value,
		accept,
		multiple,
		maxCount,
		onChange: useMemoizedFn(({ file, fileList }) => {
			const { status } = file

			if (status !== 'done') return

			onChange(fileList)
		}),
		onRemove: useMemoizedFn(file => {
			onChange(value.filter(item => item.uid !== file.uid))
		}),
		customRequest: useMemoizedFn(async res => {
			const { file, onSuccess } = res

			const base64 = await fileToBase64(file as Blob)

			onSuccess(base64)
		})
	}

	return (
		<Dragger className={$cx(styles._local, !showProgress && styles.no_progress)} {...props_dragger}>
			<div className='upload_placeholder_wrap flex align_center'>
				<UploadSimple className='mr_6' size={14}></UploadSimple>
				<span className='upload_placeholder'>
					{t('translation:components.FileUploader.placeholder')}
				</span>
			</div>
		</Dragger>
	)
}

export default $app.memo(Index)
