import { useMemoizedFn } from 'ahooks'
import { useState } from 'react'
import { Else, If, Then } from 'react-if'

import { DirItem } from './components'
import styles from './index.css'

import type { IProps } from './types'

const Index = (props: IProps) => {
	const { items, activeItem, height = '100vh', onClick } = props

	return (
		<div className={$cx('border_box', styles._local)} style={{ height }}>
			<If condition={items?.length}>
				<Then>
					<div className='dir_tree_wrap w_100 flex flex_column'>
						{items.map((item) => (
							<DirItem
								{...item}
								{...{ activeItem, onClick }}
								parent={null}
								key={item.id}
							></DirItem>
						))}
					</div>
				</Then>
				<Else></Else>
			</If>
		</div>
	)
}

export default $app.memo(Index)
