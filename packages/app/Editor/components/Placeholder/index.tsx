import { useTranslation } from 'react-i18next'

import styles from './index.css'

interface IProps {
	className?: HTMLDivElement['className']
	placeholder?: string
}

const Index = (props: IProps) => {
	const { placeholder, className } = props
	const { t } = useTranslation()

	return (
		<div className={$cx('__editor_placeholder absolute', styles._local, className)}>
			{placeholder ?? t('editor.placeholder')}
		</div>
	)
}

export default $app.memo(Index)
