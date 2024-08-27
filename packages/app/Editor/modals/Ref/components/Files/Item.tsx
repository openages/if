import { useMemoizedFn } from 'ahooks'
import dayjs from 'dayjs'

import { Emoji, LeftIcon } from '@/components'

import type { IPropsFileItem } from '../../types'

const Index = (props: IPropsFileItem) => {
	const { module, item, index, onItem } = props

	const onClick = useMemoizedFn(() => onItem('file', index))

	return (
		<div
			className='target_item w_100 border_box cursor_point transition_normal flex flex_column'
			onClick={onClick}
		>
			<div className='flex align_center'>
				<div className='target_icon_wrap flex justify_center align_center mr_2'>
					<Choose>
						<When condition={!!item.icon}>
							<Emoji shortcodes={item.icon!} size={12} hue={item.icon_hue}></Emoji>
						</When>
						<Otherwise>
							<LeftIcon module={module} item={item} size={12}></LeftIcon>
						</Otherwise>
					</Choose>
				</div>
				<div className='target_file_name ml_2'>{item.name}</div>
			</div>
			<span className='update_at'>{dayjs(item.update_at || item.create_at).fromNow()}</span>
		</div>
	)
}

export default $app.memo(Index)
