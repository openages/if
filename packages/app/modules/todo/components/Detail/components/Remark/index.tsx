import { useInput } from '@/modules/todo/hooks'
import { useTranslation } from 'react-i18next'
import styles from './index.css'

import type { IPropsDetailRemark } from '@/modules/todo/types'

const Index = (props: IPropsDetailRemark) => {
	const { remark, updateRemark } = props
	const { t } = useTranslation()
	const { input, onInput } = useInput({
		value: remark,
		update: updateRemark
	})

	return (
		<div className={$cx('w_100 border_box relative', styles._local)}>
			<div
				className='textarea w_100 border_box'
				contentEditable='plaintext-only'
				data-placeholder={t('translation:todo.Detail.remark.placeholder')}
				ref={input}
				onInput={onInput}
			></div>
		</div>
	)
}

export default $app.memo(Index)
