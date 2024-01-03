import { useTranslation } from 'react-i18next'

import { Sun } from '@phosphor-icons/react'

const Index = () => {
	const { t } = useTranslation()

	return (
		<div className='other_wrap flex justify_center align_center'>
			<Sun size={11}></Sun>
			<span className='text' style={{ marginLeft: 3 }}>
				{t('translation:modules.schedule')}
			</span>
		</div>
	)
}

export default $app.memo(Index)
