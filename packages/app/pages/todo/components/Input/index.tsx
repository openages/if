import { Input } from 'antd'

import { useLimits } from '@/hooks'

import styles from './index.css'

const { TextArea } = Input

const Index = () => {
	const limits = useLimits()

	return (
		<div className={$cx('w_100 fixed bottom_0 z_index_1000', styles._local)}>
			<div className='limited_content_wrap'>
				<TextArea
					className='input_add_todo w_100 border_box'
					placeholder='添加任务'
					maxLength={limits.todo_text_max_length}
                              autoSize
				></TextArea>
			</div>
		</div>
	)
}

export default $app.memo(Index)
