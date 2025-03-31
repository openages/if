import { useMemoizedFn } from 'ahooks'
import { useTranslation } from 'react-i18next'

import styles from './index.css'

import type { IPropsActions } from '../../types'
const Index = (props: IPropsActions) => {
	const { save } = props
	const { t } = useTranslation()

	const saveAsMd = useMemoizedFn(() => save('fs'))
	const saveToNote = useMemoizedFn(() => save('note'))

	return (
		<div
			className={$cx(
				'w_100 border_box flex justify_center align_center absolute bottom_0 z_index_10',
				styles._local
			)}
		>
			<button className='btn flex justify_center align_center clickable' onClick={saveAsMd}>
				{t('doc_parser.save_as_md')}
			</button>
			<button className='btn btn_note flex justify_center align_center clickable' onClick={saveToNote}>
				{t('doc_parser.save_to_note')}
			</button>
		</div>
	)
}

export default $app.memo(Index)
