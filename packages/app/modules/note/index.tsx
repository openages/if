import { observer } from 'mobx-react-lite'
import { useLayoutEffect, useState } from 'react'
import { container } from 'tsyringe'

import Model from './model'

import type { IProps } from './types'

const Index = ({ id }: IProps) => {
	const [x] = useState(() => container.resolve(Model))

	useLayoutEffect(() => {
		x.init({ id })

		return () => x.off()
	}, [id])

	if (!x?.file?.id) return

	return <div className={$cx('w_100 h_100 border_box')}></div>
}

export default new $app.handle(Index).by(observer).by($app.memo).get()
