import { useMemoizedFn } from 'ahooks'
import { Switch, Tooltip } from 'antd'
import { difference } from 'lodash-es'
import { useTranslation } from 'react-i18next'

import { Todos } from '@/atoms'

import styles from './index.css'

import type { IPropsTaskPanel } from '../../types'
const Index = (props: IPropsTaskPanel) => {
	const { schedule_ids, task_panel_clear_mode, toggleTaskPanelClearMode, updateTodoSchedule } = props
	const { t } = useTranslation()

	const onChange = useMemoizedFn((ids: Array<string>) => {
		const remove_ids = difference(schedule_ids, ids)

		if (!remove_ids.length) return

		updateTodoSchedule(remove_ids[0])
	})

	return (
		<div className={$cx('border_box flex flex_column', styles._local)}>
			<div className='panel_header w_100 border_box flex justify_between align_center'>
				<span>{t('translation:schedule.pending_todos')}</span>
				<Tooltip title={t('translation:schedule.clear_mode_tooltip')} destroyTooltipOnHide>
					<Switch
						size='small'
						checked={task_panel_clear_mode}
						onChange={toggleTaskPanelClearMode}
					></Switch>
				</Tooltip>
			</div>
			<div className='todo_items_wrap w_100 border_box'>
				<Todos
					ids={schedule_ids}
					mode='draggable'
					dnd_data={{ signal: 'task_panel' }}
					onChange={onChange}
				></Todos>
			</div>
		</div>
	)
}

export default $app.memo(Index)
