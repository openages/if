import { useHover, useMemoizedFn } from 'ahooks'
import { useEffect, useMemo, useRef } from 'react'

import { Emoji, LeftIcon } from '@/components'
import { getEditorText } from '@/utils/editor'
import { ArrowBendDownLeft } from '@phosphor-icons/react'

import styles from './index.css'

import type { Note, DirTree } from '@/types'
import type { IPropsSearch } from '@/layout/types'

interface IProps extends Pick<IPropsSearch, 'changeSearchIndex'> {
	item: Note.Item
	file: DirTree.Item
	text: string
	active: boolean
	index: number
	onCheck: (args: { id: string; file: DirTree.Item }) => Promise<void>
}

const Index = (props: IProps) => {
	const { item, file, text, active, index, changeSearchIndex, onCheck } = props
	const ref = useRef(null)
	const hover = useHover(ref)

	useEffect(() => {
		hover && changeSearchIndex(index)
	}, [hover])

	const array_text = useMemo(() => getEditorText(item.content, true).split(text), [item.content, text])

	const onItem = useMemoizedFn(() => onCheck({ id: item.id, file }))

	return (
		<div
			id={`search_item_${item.id}`}
			className={$cx(
				'search_item w_100 border_box cursor_point transition_normal flex flex_column justify_center relative',
				styles._local,
				active && 'active'
			)}
			ref={ref}
			onClick={onItem}
		>
			<ArrowBendDownLeft className='icon_go absolute right_0' weight='bold'></ArrowBendDownLeft>
			<div className='text_wrap'>
				{array_text.map((it, idx) => (
					<span className='text_item' key={idx}>
						<span>{it.slice(0, 30)}</span>
						{idx !== array_text.length - 1 && <span className='color_main'>{text}</span>}
					</span>
				))}
			</div>
			<div className='detail_wrap flex align_center mt_4'>
				<div className='file_wrap flex align_center mr_8'>
					<div className='icon_wrap flex justify_center align_center'>
						<Choose>
							<When condition={!!file.icon}>
								<Emoji shortcodes={file.icon} size={10} hue={file.icon_hue}></Emoji>
							</When>
							<Otherwise>
								<LeftIcon module='todo' item={file} size={10}></LeftIcon>
							</Otherwise>
						</Choose>
					</div>
					<span className='file_name ml_2'>{file.name}</span>
				</div>
			</div>
		</div>
	)
}

export default $app.memo(Index)
