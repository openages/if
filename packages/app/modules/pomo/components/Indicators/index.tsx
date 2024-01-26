import { useMemoizedFn } from 'ahooks'

import styles from './index.css'

import type { IPropsIndicators } from '../../types'

const Index = (props: IPropsIndicators) => {
	const { view_index, index, counts, changeViewIndex } = props

	const getStatus = useMemoizedFn((idx: number) => {
		if (index === idx) return 'active'
		if (idx < index) return 'done'
		if (view_index === idx) return 'view'
	})

	const onItem = useMemoizedFn(e => {
		const target = e.target as HTMLDivElement
		const idx = target.getAttribute('data-idx')

		if (idx === undefined) return

		changeViewIndex(Number(idx))
	})

	return (
		<div className={$cx('flex justify_center', styles._local)} onClick={onItem}>
			{Array.from({ length: counts }).map((_, idx) => (
				<div className={$cx('indicator_item flex clickable', getStatus(idx))} data-idx={idx} key={idx}>
					<span className='dot border_box' data-idx={idx}></span>
				</div>
			))}
		</div>
	)
}

export default $app.memo(Index)
