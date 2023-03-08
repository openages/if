import { observer } from 'mobx-react-lite'
import { CaretLeft, CaretRight } from 'phosphor-react'
import { useRef } from 'react'
import { Else, If, Then } from 'react-if'

import { useGlobal } from '@/context/app'
import { useDragWidth } from '@/hooks'

import styles from './index.css'

const Index = () => {
	const ref = useRef<HTMLDivElement>(null)
	const global = useGlobal()
	const draging = useDragWidth(ref, '--dirtree_width', global.layout.setDirTreeWidth)

	return (
		<div
			className={$cx(
				'drag_line flex justify_center align_center absolute top_0 right_0 h_100 z_index_10 transition_normal',
				styles._local,
				draging && styles.draging,
				global.layout.dirtree_width === 0 && styles.hide
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
						<CaretRight className='icon transition_normal' size={18} weight='bold'></CaretRight>
					</Else>
				</If>
			</div>
		</div>
	)
}

export default new $app.handle(Index).by(observer).by($app.memo).get()
