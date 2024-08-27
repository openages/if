import dayjs from 'dayjs'
import { useTranslation } from 'react-i18next'

import { format } from '@/utils/date'

import DateTime from '../../DateTime'
import styles from '../index.css'

import type { Todo } from '@/types'
import type { IPropsFormTableComponent } from '@/components'

const Index = (props: IPropsFormTableComponent<Todo.Todo['end_time']>) => {
	const { value, editing, onFocus, onChange } = props
	const { t } = useTranslation()

	return (
		<div className={$cx('w_100 flex justify_center', styles.DateTime)}>
			<Choose>
				<When condition={editing}>
					<DateTime
						useByDetail
						ignoreDetail
						value={value!}
						onFocus={onFocus}
						onChange={onChange!}
					></DateTime>
				</When>
				<Otherwise>
					{value ? (
						<span className='viewer_wrap'>{format(dayjs(value), true)}</span>
					) : (
						<span className='viewer_wrap color_text_light'>{t('common.unset')}</span>
					)}
				</Otherwise>
			</Choose>
		</div>
	)
}

export default $app.memo(Index)
