import { useNavigate } from 'react-router-dom'

import { useCreateLayoutEffect } from '@/hooks'

export default () => {
	const navigate = useNavigate()

	useCreateLayoutEffect(() => {
		$navigate = navigate
	}, [navigate])
}
