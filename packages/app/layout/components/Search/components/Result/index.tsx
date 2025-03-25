import { useMemoizedFn } from 'ahooks'

import { LazyElement } from '@/components'

import styles from './index.css'

import type { IPropsSearchResult } from '@/layout/types'
const Index = (props: IPropsSearchResult) => {
	const { module, items, index, text, onCheck: check, changeSearchIndex, hideResult } = props

	const onCheck = useMemoizedFn(args => {
		check(args)
		hideResult?.()
	})

	return (
		<div className={$cx('w_100 flex flex_column', styles._local)}>
			{items.map(({ item, file, setting }, idx) => (
				<LazyElement
					type='search'
					path={module}
					props={{
						item,
						file,
						text,
						setting,
						active: idx === index,
						index: idx,
						onCheck,
						changeSearchIndex
					}}
					key={item.id}
				></LazyElement>
			))}
		</div>
	)
}

export default $app.memo(Index)
