import dayjs from 'dayjs'

import getDayDetails from './getDayDetails'

const static_days = ['2024-02-12', '2024-02-13', '2024-02-14', '2024-02-15', '2024-02-16', '2024-02-17', '2024-02-18']

export default () => {
	return static_days.map(item => getDayDetails(dayjs(item)))
}
