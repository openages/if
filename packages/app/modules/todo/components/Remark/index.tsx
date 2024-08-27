import { useTranslation } from 'react-i18next'

import { useText, useTextChange, Text } from '@/Editor'

import styles from './index.css'

import type { IPropsDetailRemark } from '@/modules/todo/types'

const Index = (props: IPropsDetailRemark) => {
	const { remark, in_modal, updateRemark } = props
	const { t } = useTranslation()
	const { ref_editor, onChange, setEditor, setRef } = useText({ text: remark!, update: updateRemark })

	useTextChange({ ref_editor, text: remark! })

	return (
		<div className={$cx('w_100 border_box relative', styles._local, in_modal && styles.in_modal)}>
			<Text
				className='textarea w_100 border_box'
				placeholder_classname='textarea_placeholder'
				max_length={1500}
				linebreak
				placeholder={t('todo.Detail.remark.placeholder')}
				onChange={onChange}
				setEditor={setEditor}
				setRef={setRef}
			></Text>
		</div>
	)
}

export default $app.memo(Index)
