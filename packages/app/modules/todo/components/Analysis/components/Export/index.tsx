import { useMemoizedFn } from 'ahooks'
import { Button, Input } from 'antd'
import { useTranslation } from 'react-i18next'

import { Copy, DownloadSimple } from '@phosphor-icons/react'

import styles from './index.css'

import type { IPropsAnalysisExport } from '@/modules/todo/types'
import type { ChangeEvent } from 'react'

const Index = (props: IPropsAnalysisExport) => {
	const { prefix, disabled, setPrefix, exportTodos, copyToClipboard } = props
	const { t } = useTranslation()

	const onChangePrefix = useMemoizedFn((e: ChangeEvent<HTMLInputElement>) => setPrefix(e.target.value))
	const exportJson = useMemoizedFn(() => exportTodos('json'))
	const exportText = useMemoizedFn(() => exportTodos('text'))

	return (
		<div className={$cx('w_100 border_box flex justify_between align_center', styles._local)}>
			<div className='flex align_center'>
				<Input
					variant='filled'
					placeholder={t('common.prefix')}
					defaultValue={prefix}
					onBlur={onChangePrefix}
				></Input>
				<span className='label ml_6'>
					{`\{\{angle\}\}`}
					{`\{\{tag\}\}`}
				</span>
			</div>
			<div className='flex align_center'>
				<Button
					className='btn_json clickable mr_12'
					color='default'
					variant='filled'
					icon={<DownloadSimple></DownloadSimple>}
					disabled={disabled}
					onClick={exportJson}
				>
					JSON
				</Button>
				<Button
					className='btn_json clickable mr_12'
					color='default'
					variant='filled'
					icon={<DownloadSimple></DownloadSimple>}
					disabled={disabled}
					onClick={exportText}
				>
					Txt
				</Button>
				<Button
					className='btn_export clickable'
					type='primary'
					icon={<Copy></Copy>}
					disabled={disabled}
					onClick={copyToClipboard}
				>
					{t('common.copy_to')}
				</Button>
			</div>
		</div>
	)
}

export default $app.memo(Index)
