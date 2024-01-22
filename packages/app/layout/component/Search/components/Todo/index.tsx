import { useHover, useMemoizedFn } from 'ahooks'
import { useEffect, useMemo, useRef } from 'react'
import { useTranslation } from 'react-i18next'
import { Else, If, Then } from 'react-if'

import { Emoji, LeftIcon } from '@/components'
import { ArrowBendDownLeft } from '@phosphor-icons/react'

import styles from './index.css'

import type { App, Todo, DirTree } from '@/types'
import type { IPropsSearch } from '@/layout/types'

interface IProps extends Pick<IPropsSearch, 'changeSearchIndex'> {
	module: App.ModuleType
	item: Todo.Todo
	file: DirTree.Item
	setting: Todo.Setting
	text: string
	active: boolean
	index: number
	onCheck: (id: string, file: DirTree.Item) => Promise<void>
}

const Index = (props: IProps) => {
	const { module, item, file, setting, text, active, index, changeSearchIndex, onCheck } = props
	const { t } = useTranslation()
	const ref = useRef(null)
	const hover = useHover(ref)

	useEffect(() => {
		hover && changeSearchIndex(index)
	}, [hover])

	const array_text = item.text.split(text)

	const angle = useMemo(() => setting.angles.find(i => i.id === item.angle_id), [item.angle_id, setting.angles])

	const tags = useMemo(() => {
		if (!item?.tag_ids?.length || !setting.tags?.length) return []

		return item.tag_ids
			.map(tag_id => setting.tags.find(i => i.id === tag_id))
			.filter(it => it)
			.map(it => it.text)
	}, [item.tag_ids, setting.tags])

	const onItem = useMemoizedFn(() => onCheck(item.id, file))

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
						<span>{it}</span>
						{idx !== array_text.length - 1 && <span className='color_main'>{text}</span>}
					</span>
				))}
			</div>
			<div className='detail_wrap flex align_center mt_4'>
				<div className='file_wrap flex align_center mr_8'>
					<div className='icon_wrap flex justify_center align_center'>
						<If condition={file.icon}>
							<Then>
								<Emoji shortcodes={file.icon} size={10} hue={file.icon_hue}></Emoji>
							</Then>
							<Else>
								<LeftIcon module={module} item={file} size={10}></LeftIcon>
							</Else>
						</If>
					</div>
					<span className='file_name ml_2'>{file.name}</span>
				</div>
				<span className='angle mr_8'>{angle.text}</span>
				{tags.length > 0 && (
					<span className='tags flex align_center mr_8'>
						{tags.map((i, idx) => (
							<div className='tag flex align_center' key={i}>
								{i} {idx !== tags.length - 1 && <span className='dot ml_4 mr_4'></span>}
							</div>
						))}
					</span>
				)}
				{item.archive && <span className='archived'>{t('translation:todo.common.archived')}</span>}
			</div>
		</div>
	)
}

export default $app.memo(Index)
