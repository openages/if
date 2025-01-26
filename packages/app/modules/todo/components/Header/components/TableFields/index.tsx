import { useMemoizedFn } from 'ahooks'
import { Checkbox } from 'antd'
import { omitBy } from 'lodash-es'
import { useMemo } from 'react'

import styles from './index.css'

import type { IPropsHeaderTableFields } from '@/modules/todo/types'

const { Group } = Checkbox

const fields = [
	{ label: $t('todo.Archive.filter.angle'), value: 'angle_id' },
	{ label: $t('todo.Header.options.tags'), value: 'tag_ids' },
	{ label: $t('todo.common.priority'), value: 'level' },
	{ label: $t('todo.Input.Remind.title'), value: 'remind_time' },
	{ label: $t('todo.Input.Deadline.title'), value: 'end_time' },
	{ label: $t('todo.Input.Cycle.title'), value: 'cycle' },
	{ label: $t('modules.schedule'), value: 'schedule' },
	{ label: $t('todo.common.children'), value: 'children' },
	{ label: $t('todo.Archive.title'), value: 'archive' },
	{ label: $t('todo.Header.options.sort.create_at'), value: 'create_at' },
	{ label: $t('todo.common.done_time'), value: 'done_time' },
	{ label: $t('todo.common.duration'), value: 'duration' }
]

const Index = (props: IPropsHeaderTableFields) => {
	const { table_exclude_fields, updateSetting } = props

	const value = useMemo(
		() => fields.filter(item => !table_exclude_fields.includes(item.value)).map(item => item.value),
		[table_exclude_fields]
	)

	const onChange = useMemoizedFn((v: Array<string>) => {
		const target = fields.filter(item => !v.includes(item.value)).map(item => item.value)

		updateSetting({ table_exclude_fields: target })
	})

	return (
		<div className={$cx('border_box flex flex_column', styles._local)}>
			<Group options={fields} value={value} onChange={onChange}></Group>
		</div>
	)
}

export default $app.memo(Index)
