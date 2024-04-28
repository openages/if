import { observer } from 'mobx-react-lite'
import { useEffect, useLayoutEffect, useState } from 'react'
import { container } from 'tsyringe'

import { Note } from '@/Editor'
import { useCurrentModule } from '@/hooks'

import styles from './index.css'
import Model from './model'

import type { IProps } from './types'

const Index = ({ id }: IProps) => {
	const [x] = useState(() => container.resolve(Model))
	const module = useCurrentModule()

	useLayoutEffect(() => {
		x.init({ id })

		return () => x.off()
	}, [id])

	useEffect(() => {
		x.module = module
	}, [module])

	if (!x?.file?.id) return

	return (
		<div className={$cx('w_100 border_box flex flex_column limited_content_wrap', styles._local)}>
			<input className={styles.title} defaultValue={x.file.data.name} onBlur={x.onChangeFileName}></input>
			<Note></Note>
		</div>
	)
}

export default new $app.handle(Index).by(observer).by($app.memo).get()
