import { unstable_Activity as Activity } from 'react'
import View from '../View'
import styles from './index.css'

import type { IPropsStacksContent } from '../../../../types'

const Index = (props: IPropsStacksContent) => {
	const { columns } = props

	return (
		<div className='w_100 flex'>
			{columns.map((column, index) => (
				<div className={$cx(styles.Column)} style={{ width: column.width }} key={index}>
					{column.views.map(item => (
						<Activity mode={item.active ? 'visible' : 'hidden'} key={item.id}>
							<View module={item.module} id={item.id}></View>
						</Activity>
					))}
				</div>
			))}
		</div>
	)
}

export default $app.memo(Index)
