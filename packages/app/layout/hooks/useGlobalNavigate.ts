import { useNavigate } from 'react-router-dom'

import { useMountEffect } from '@/hooks'

export default () => {
	const navigate = useNavigate()

	useMountEffect(() => {
		$navigate = navigate
	}, [navigate])
}
