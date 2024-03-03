import dayjs from 'dayjs'
import { useTranslation } from 'react-i18next'
import { Else, If, Then } from 'react-if'

import { format } from '@/utils/date'

import DateTime from '../../DateTime'
import styles from '../index.css'

import type { Todo } from '@/types'
import type { IPropsFormTableComponent } from '@/components'

const Index = (props: IPropsFormTableComponent<Todo.Todo['remind_time']>) => {
	const { value, editing, onFocus, onChange } = props
	const { t } = useTranslation()

	return (
		<div className={$cx('w_100 flex justify_center', styles.DateTime)}>
			<If condition={editing}>
				<Then>
					<DateTime
						useByDetail
						ignoreDetail
						value={value}
						onFocus={onFocus}
						onChange={onChange}
					></DateTime>
				</Then>
				<Else>
					{value ? (
						<span className='viewer_wrap'>{format(dayjs(value), true)}</span>
					) : (
						<span className='viewer_wrap color_text_light'>
							{t('translation:common.unset')}
						</span>
					)}
				</Else>
			</If>
		</div>
	)
}

export default $app.memo(Index)
