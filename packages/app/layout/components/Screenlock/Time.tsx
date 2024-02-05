import dayjs from 'dayjs'
import { useEffect, useState } from 'react'

const Index = () => {
	const [time, setTime] = useState(() => dayjs())

	useEffect(() => {
		const timer = setInterval(() => setTime(dayjs()), 1000)

		return () => clearInterval(timer)
	}, [])

	return (
		<div className='time_wrap absolute flex flex_column justify_center align_center'>
			<div className='time flex align_center'>
				<span className='time_item text_center'>{time.format('HH')}</span>
				<span className='divide'>:</span>
				<span className='time_item text_center'>{time.format('mm')}</span>
				<span className='divide'>:</span>
				<span className='time_item text_center'>{time.format('ss')}</span>
			</div>
			<div className='date flex align_center'>
				{time.format('YYYY-MM-DD')} {time.format('dddd')}
			</div>
		</div>
	)
}

export default $app.memo(Index)
