import '@antv/x6-react-shape'

import { useEffect, useRef, useState } from 'react'
import { container } from 'tsyringe'

import { PortalProvider } from './components'
import styles from './index.css'
import Model from './model'
import { register } from './utils'

import type { IPropsMindmap } from '../../types'

const Index = (props: IPropsMindmap) => {
	const [x] = useState(() => container.resolve(Model))

	const {
		kanban_items,
		tags,
		angles,
		relations,
		check,
		updateRelations,
		insert,
		update,
		tab,
		moveTo,
		remove,
		handleOpenItem,
		showDetailModal
	} = props
	const ref = useRef<HTMLDivElement>(null)

	useEffect(() => {
		// register({ tags, angles, check, insert, update, tab, moveTo, remove, handleOpenItem, showDetailModal })

		x.init({ container: ref.current })

		return () => x.off()
	}, [tags, angles])

	return (
		<div className={$cx('flex', styles._local)}>
			<PortalProvider />
			<div className='mindmap_wrap w_100 h_100 border_box flex'>
				<div className='w_100 h_100' ref={ref}></div>
			</div>
		</div>
	)
}

export default $app.memo(Index)
