import { Input } from 'antd'

import { limits } from '@/appdata'
import { useGetLocale } from '@/hooks'

import styles from './index.css'

const { TextArea } = Input

const Index = () => {
	const locale = useGetLocale()

	return (
		<div className={$cx('w_100', styles._local)}>
			<div className='limited_content_wrap'>
				<TextArea
					className='input_add_todo w_100 border_box'
					placeholder='添加任务'
					maxLength={limits[locale].todo_text_max_length}
					autoSize
				></TextArea>
			</div>
		</div>
	)
}

export default $app.memo(Index)
