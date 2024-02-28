import { useHover, useMemoizedFn } from 'ahooks'
import dayjs from 'dayjs'
import { useRef } from 'react'

import { ArchiveBox, Spinner, UploadSimple } from '@phosphor-icons/react'

import styles from '../index.css'

import type { IPropsFormTableComponent } from '@/components'

import type { Todo } from '@/types'

const Index = (props: IPropsFormTableComponent<Todo.Todo['archive']>) => {
	const { value, deps, onChange } = props
	const { archive_time } = deps
	const ref = useRef(null)
	const hover = useHover(ref)

	const archive = useMemoizedFn(() => onChange(false))

	return (
		<div className={$cx('flex flex_column justify_center align_center', styles.RenderArchive)}>
			{value && (
				<div
					className='btn_active flex justify_center align_center cursor_point clickable'
					ref={ref}
					onClick={archive}
				>
					{hover ? (
						<UploadSimple className='icon_inactive icon' size={14}></UploadSimple>
					) : (
						<ArchiveBox className='icon_active icon' size={14}></ArchiveBox>
					)}
				</div>
			)}
			{!value && !archive_time && <Spinner className='icon_doing' size={14} weight='bold'></Spinner>}
			{!value && archive_time && (
				<span className='archive_time color_text_light'>{dayjs().to(dayjs(archive_time))}</span>
			)}
		</div>
	)
}

export default $app.memo(Index)
