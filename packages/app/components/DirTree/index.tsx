import { observer } from 'mobx-react-lite'
import { Else, If, Then, When } from 'react-if'

import { useGlobal } from '@/context/app'

import { DirItem, DragLine, Search } from './components'
import styles from './index.css'

import type { IProps } from './types'

const Index = (props: IProps) => {
	const { items, activeItem, height = '100vh', onClick } = props
	const global = useGlobal()

	return (
		<div
			className={$cx(
				'border_box relative',
				styles._local,
				global.layout.dirtree_width === 0 && styles.hide
			)}
			style={{ height }}
		>
			<When condition={global.layout.dirtree_width !== 0}>
				<Search></Search>
			</When>
			<DragLine></DragLine>
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

export default new $app.handle(Index).by(observer).by($app.memo).get()
