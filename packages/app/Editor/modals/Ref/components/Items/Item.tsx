import { useMemoizedFn } from 'ahooks'
import { useMemo } from 'react'

import { Emoji, LeftIcon } from '@/components'
import { getEditorText } from '@/utils/editor'

import type { Todo } from '@/types'
import type { IPropsItem } from '../../types'

const Index = (props: IPropsItem) => {
	const { module, item, index, onItem } = props
	const target = item.item as Todo.Todo
	const file = item.file

	const text = useMemo(() => {
		if (module === 'todo' || module === 'schedule') {
			return getEditorText(target.text)
		}

		return target.text
	}, [module, target])

	const onClick = useMemoizedFn(() => onItem(module, index))

	return (
		<div
			className='target_item w_100 border_box cursor_point transition_normal flex flex_column justify_center'
			onClick={onClick}
		>
			<div className='text_wrap'>{text}</div>
			<div className='file_wrap flex align_center'>
				<div className='icon_wrap flex justify_center align_center'>
					<Choose>
						<When condition={!!file.icon}>
							<Emoji shortcodes={file.icon!} size={10} hue={file.icon_hue}></Emoji>
						</When>
						<Otherwise>
							<LeftIcon module={module} item={file} size={10}></LeftIcon>
						</Otherwise>
					</Choose>
				</div>
				<span className='file_name ml_2'>{file.name}</span>
			</div>
		</div>
	)
}

export default $app.memo(Index)
