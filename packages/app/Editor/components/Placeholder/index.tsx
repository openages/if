import { useTranslation } from 'react-i18next'

import styles from './index.css'

const Index = () => {
	const { t } = useTranslation()

	return (
		<div className={$cx('__editor_placeholder absolute', styles._local)}>
			{t('translation:editor.placeholder')}
		</div>
	)
}

export default $app.memo(Index)
