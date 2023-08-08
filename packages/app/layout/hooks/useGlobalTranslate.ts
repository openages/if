import { useLayoutEffect } from 'react'
import { useTranslation } from 'react-i18next'

export default () => {
      const { t } = useTranslation()

	useLayoutEffect(() => {
		$t = t 
	}, [t])
}
