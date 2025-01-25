import { useMemoizedFn } from 'ahooks'
import { Button, Input } from 'antd'

import styles from './index.css'

import type { IPropsAnalysisExport } from '@/modules/todo/types'
import type { ChangeEvent } from 'react'

const Index = (props: IPropsAnalysisExport) => {
	const { prefix, disabled, setPrefix, exportTodos } = props

	const onChangePrefix = useMemoizedFn((e: ChangeEvent<HTMLInputElement>) => setPrefix(e.target.value))

	return (
		<div className={$cx('w_100 border_box flex justify_between align_center', styles._local)}>
			<div className='flex align_center'>
				<Input
					variant='filled'
					placeholder='前缀'
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
					disabled={disabled}
				>
					JSON
				</Button>
				<Button className='btn_export clickable' type='primary' disabled={disabled}>
					导出
				</Button>
			</div>
		</div>
	)
}

export default $app.memo(Index)
