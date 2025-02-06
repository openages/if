import { useMemoizedFn } from 'ahooks'
import { Drawer } from 'antd'
import { groupBy } from 'lodash-es'
import { observer } from 'mobx-react-lite'
import mustache from 'mustache'
import { useMemo, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { match } from 'ts-pattern'

import { useGlobal } from '@/context/app'
import { downloadFile } from '@/utils'

import { Chart, Duration, Export, List, ListHeader } from './components'

import type {
	IPropsAnalysis,
	IPropsAnalysisDuration,
	IPropsAnalysisChart,
	IPropsAnalysisListHeader,
	IPropsAnalysisList,
	IPropsAnalysisExport
} from '../../types'
import type { Todo } from '@/types'

interface ArgsGetData {
	items: Array<Todo.Todo>
	endline?: boolean
	getPrefix: (item: Todo.Todo) => string
}

const getData = (args: ArgsGetData) => {
	const { items, endline, getPrefix } = args

	return (
		items.reduce((total, item) => {
			const prefix = getPrefix(item)

			total = total + (prefix ? `${prefix}: ` : '') + item.text + '\n'

			return total
		}, '') + (endline ? '\n' : '')
	)
}

const Index = (props: IPropsAnalysis) => {
	const {
		visible_analysis_modal,
		angles,
		tags,
		trending,
		items,
		analysis_duration,
		analysis_sort_params,
		analysis_filter_angles,
		analysis_filter_tags,
		setDuration,
		setSortParams,
		setFilterAngles,
		setFilterTags,
		onClose
	} = props
	const { t } = useTranslation()
	const global = useGlobal()
	const [group_by, setGroupBy] = useState<'angle' | 'tag' | null>(null)
	const [prefix, setPrefix] = useState('')

	const unpaid = !global.auth.is_paid_user && ['monthly', 'quarterly', 'yearly'].includes(analysis_duration)

	const props_duration: IPropsAnalysisDuration = {
		unpaid: !global.auth.is_paid_user,
		analysis_duration,
		total: useMemo(
			() =>
				(trending?.create?.at(-1) || 0) +
				(trending?.done?.at(-1) || 0) +
				(trending?.uncheck?.at(-1) || 0) +
				(trending?.close?.at(-1) || 0),
			[trending]
		),
		setDuration
	}

	const props_chart: IPropsAnalysisChart = {
		unpaid,
		trending
	}

	const props_list_header: IPropsAnalysisListHeader = {
		unpaid,
		angles,
		tags,
		analysis_sort_params,
		analysis_filter_angles,
		analysis_filter_tags,
		group_by,
		setSortParams,
		setFilterAngles,
		setFilterTags,
		setGroupBy: useMemoizedFn(setGroupBy)
	}

	const getPrefix = useMemoizedFn((item: Todo.Todo) => {
		if (!prefix) return ''

		const angle = angles.find(angle => angle.id === item.angle_id)!

		const data = { angle: angle.text, tag: '' }

		if (item.tag_ids) {
			const target_tags = item.tag_ids.map(tag_id => {
				return tags.find(tag => tag.id === tag_id)!.text
			})

			data['tag'] = `(${target_tags.join('&')})`
		}

		return mustache.render(prefix, data)
	})

	const data = useMemo(() => {
		let result = ''

		match(group_by)
			.with('angle', () => {
				const target = groupBy(items, 'angle_id')

				Object.keys(target).forEach(angle_id => {
					const angle = angles.find(item => item.id === angle_id)!
					const todos = target[angle_id]

					result += angle.text + '\n'
					result += getData({ items: todos, endline: true, getPrefix })
				})
			})
			.with('tag', () => {
				const target = tags.reduce(
					(total, item) => {
						total[item.id] = []

						return total
					},
					{} as Record<string, Array<Todo.Todo>>
				)

				const target_notag = [] as Array<Todo.Todo>

				items.forEach(item => {
					if (item.tag_ids && item.tag_ids.length) {
						item.tag_ids.forEach(tag_id => {
							target[tag_id].push(item)
						})
					} else {
						target_notag.push(item)
					}
				})

				Object.keys(target).forEach(tag_id => {
					const tag = tags.find(item => item.id === tag_id)!
					const todos = target[tag_id]

					if (todos.length) {
						result += tag.text + '\n'
						result += getData({ items: todos, endline: true, getPrefix })
					}
				})

				result += getData({ items: target_notag, getPrefix })
			})
			.otherwise(() => {
				result += getData({ items, getPrefix })
			})

		return result
	}, [items, angles, tags, group_by, prefix])

	const props_list: IPropsAnalysisList = {
		unpaid,
		data
	}

	const props_export: IPropsAnalysisExport = {
		unpaid,
		prefix,
		disabled: useMemo(() => !items.length, [items]),
		setPrefix,
		exportTodos: useMemoizedFn(type => {
			match(type)
				.with('json', () => {
					downloadFile(
						`if_todo_analysis_${analysis_duration}_${trending?.dates.at(-1)}`,
						JSON.stringify(items),
						'json'
					)
				})
				.with('text', () => {
					downloadFile(
						`if_todo_analysis_${analysis_duration}_${trending?.dates.at(-1)}`,
						data,
						'txt'
					)
				})
				.exhaustive()
		}),
		copyToClipboard: useMemoizedFn(async () => {
			await navigator.clipboard.writeText(data)

			$message.success(t('common.copied'))
		})
	}

	return (
		<Drawer
			open={visible_analysis_modal}
			title={t('todo.Analysis.title')}
			width='min(624px,calc(100% - 24px))'
			destroyOnClose
			getContainer={false}
			footer={<Export {...props_export}></Export>}
			onClose={onClose}
		>
			<Duration {...props_duration}></Duration>
			<Chart {...props_chart}></Chart>
			<ListHeader {...props_list_header}></ListHeader>
			<List {...props_list}></List>
		</Drawer>
	)
}

export default new $app.handle(Index).by(observer).by($app.memo).get()
