import { observer } from 'mobx-react-lite'
import { CaretLeft, CaretRight } from 'phosphor-react'
import { useRef } from 'react'
import { Else, If, Then } from 'react-if'

import { useGlobal } from '@/context/app'

import { DirItem } from './components'
import { useDragDirTreeWidth } from './hooks'
import styles from './index.css'

import type { IProps } from './types'

const Index = (props: IProps) => {
	const { items, activeItem, height = '100vh', onClick } = props
	const global = useGlobal()
	const ref = useRef<HTMLDivElement>(null)
	const draging = useDragDirTreeWidth(global, ref)

	return (
		<div
			className={$cx(
				'border_box relative',
				styles._local,
				global.layout.dirtree_width === 0 && styles.hide
			)}
			style={{ height }}
		>
			<div
				className={$cx(
					'drag_line flex justify_center align_center absolute top_0 right_0 h_100 z_index_10 transition_normal',
					draging && 'draging'
				)}
				ref={ref}
			>
				<div
					className='btn_hide_wrap border_box flex justify_center align_center transition_normal'
					onClick={() => global.layout.toggleDirTreeVisible()}
				>
					<If condition={global.layout.dirtree_width !== 0}>
						<Then>
							<CaretLeft size={18} weight='bold'></CaretLeft>
						</Then>
						<Else>
							<CaretRight
								className='icon transition_normal'
								size={18}
								weight='bold'
							></CaretRight>
						</Else>
					</If>
				</div>
			</div>
			<If condition={items?.length}>
				<Then>
					<div className='dir_tree_wrap w_100 h_100 flex flex_column'>
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

export default new $app.handle(Index).by(observer).by($app.memo).get()
