import { useLayoutEffect } from 'react'
import { useNavigate } from 'react-router-dom'

export default () => {
	const navigate = useNavigate()

	useLayoutEffect(() => {
		$navigate = navigate
	}, [navigate])
}
