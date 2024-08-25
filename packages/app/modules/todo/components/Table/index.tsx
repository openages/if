import { useMemoizedFn } from 'ahooks'
import { useRef } from 'react'
import { useTranslation } from 'react-i18next'
import { match } from 'ts-pattern'

import { FormTable } from '@/components'
import { getItemStatus } from '@/utils/modules/todo'
import { useDeepMemo } from '@openages/stk/react'

import {
	Filter,
	RenderAngle,
	RenderArchive,
	RenderChildren,
	RenderCreateAt,
	RenderCycle,
	RenderDeadline,
	RenderLevel,
	RenderOptions,
	RenderRemind,
	RenderSchedule,
	RenderStatus,
	RenderTags,
	RenderText
} from './components'
import styles from './index.css'

import type { Todo } from '@/types'
import type { TableColumnType, PaginationProps } from 'antd'
import type { IPropsTable, IPropsTableFilter } from '../../types'
import type { IPropsFormTableColumn, IPropsFormTable } from '@/components'

type Column = TableColumnType<Todo.Todo> & { ignoreArchive?: boolean; deps?: Array<Partial<keyof Todo.Todo>> }

const Index = (props: IPropsTable) => {
	const {
		relations,
		items,
		angles,
		tags,
		table_pagination,
		visible_table_filter,
		onTableRowChange,
		onTableSortChange,
		onTablePageChange,
		clean,
		showDetailModal,
		remove,
		onTableSearch
	} = props
	const { t } = useTranslation()
	const scroller = useRef<HTMLDivElement>(null)

	const getPropsStatus = useMemoizedFn(({ id, status }) => {
		const target = getItemStatus({ relations, id, status })

		return target ? target.linked : undefined
	})

	const getRowClassName = useMemoizedFn((item: Todo.Todo) => {
		const target = []
		const status = getItemStatus({ relations, id: item.id, status: item.status })

		if (item.archive) target.push(styles.archive)

		if (status) {
			if (status.done) target.push(styles.done)
			if (status.linked) target.push(styles.linked)
		}

		return target
	})

	const onAction: IPropsFormTableColumn['onAction'] = useMemoizedFn(
		(action: 'detail' | 'remove' | 'clean', { id }, index) => {
			match(action)
				.with('detail', () => showDetailModal({ id, index }))
				.with('remove', () => remove({ id }))
				.with('clean', () => clean(id))
				.exhaustive()
		}
	)

	const columns = useDeepMemo(
		() =>
			[
				{
					dataIndex: 'status',
					deps: ['id'],
					width: 15,
					align: 'left',
					fixed: 'left',
					alwaysEditing: true,
					component: RenderStatus,
					getProps: getPropsStatus
				},
				{
					title: t('todo.common.text'),
					dataIndex: 'text',
					width: 150,
					align: 'left',
					fixed: 'left',
					component: RenderText
				},
				{
					title: t('todo.Archive.filter.angle'),
					dataIndex: 'angle_id',
					width: 72,
					align: 'center',
					extra: { angles },
					component: RenderAngle
				},
				{
					title: t('todo.Header.options.tags'),
					dataIndex: 'tag_ids',
					width: 96,
					align: 'center',
					extra: { tags },
					component: RenderTags
				},
				{
					title: t('todo.common.level'),
					dataIndex: 'level',
					width: 96,
					align: 'center',
					sort: true,
					component: RenderLevel
				},
				{
					title: t('todo.Input.Remind.title'),
					dataIndex: 'remind_time',
					width: 96,
					align: 'center',
					sort: true,
					component: RenderRemind
				},
				{
					title: t('todo.Input.Deadline.title'),
					dataIndex: 'end_time',
					width: 96,
					align: 'center',
					sort: true,
					component: RenderDeadline
				},
				{
					title: t('todo.Input.Cycle.title'),
					dataIndex: 'cycle',
					deps: ['cycle_enabled'],
					width: 132,
					align: 'center',
					useRowChange: true,
					component: RenderCycle
				},
				{
					title: t('modules.schedule'),
					dataIndex: 'schedule',
					width: 60,
					align: 'center',
					alwaysEditing: true,
					component: RenderSchedule
				},
				{
					title: t('todo.common.children'),
					dataIndex: 'children',
					width: 60,
					align: 'center',
					disableEditing: true,
					component: RenderChildren
				},
				{
					title: t('todo.Archive.title'),
					dataIndex: 'archive',
					deps: ['archive_time'],
					width: 81,
					align: 'center',
					disableEditing: true,
					component: RenderArchive
				},
				{
					title: t('todo.Header.options.sort.create_at'),
					dataIndex: 'create_at',
					width: 102,
					align: 'center',
					ignoreArchive: true,
					sort: true,
					component: RenderCreateAt
				},
				{
					title: t('todo.common.options'),
					dataIndex: 'options',
					deps: ['id'],
					width: 81,
					align: 'center',
					fixed: 'right',
					disableEditing: true,
					component: RenderOptions,
					onAction
				}
			] as Array<IPropsFormTableColumn>,
		[angles, tags]
	)

	const pagination = {
		...table_pagination,
		showSizeChanger: true,
		pageSizeOptions: [15, 30, 60, 120, 180, 300],
		// @ts-ignore
		showTotal: useMemoizedFn(total => t('common.total', { counts: total })),
		onChange: onTablePageChange
	} as PaginationProps

	const props_filter: IPropsTableFilter = {
		visible_table_filter,
		angles,
		tags,
		onTableSearch
	}

	const props_form_table: IPropsFormTable = {
		columns,
		dataSource: items,
		scrollX: 1200,
		stickyTop: 72,
		scroller,
		pagination: table_pagination.total ? pagination : false,
		onChange: onTableRowChange,
		onChangeSort: onTableSortChange,
		getRowClassName
	}

	return (
		<div className={$cx('w_100 border_box', styles._local)} ref={scroller}>
			<div className={$cx(styles.scroll_wrap, 'table_scroll_wrap w_100 h_100 flex flex_column')}>
				<Filter {...props_filter}></Filter>
				<FormTable {...props_form_table}></FormTable>
			</div>
		</div>
	)
}

export default $app.memo(Index)
