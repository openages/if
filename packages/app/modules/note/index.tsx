import { useMemoizedFn } from 'ahooks'
import { Input } from 'antd'
import { observer } from 'mobx-react-lite'
import { useEffect, useLayoutEffect, useState } from 'react'
import { container } from 'tsyringe'

import { Note } from '@/Editor'
import { useCurrentModule } from '@/hooks'

import styles from './index.css'
import Model from './model'

import type { IProps } from './types'
const { TextArea } = Input

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

	const setEditor = useMemoizedFn(editor => (x.editor = editor))

	if (!x?.file?.id) return null

	return (
		<div className={$cx('w_100 border_box flex flex_column limited_content_wrap', styles._local)}>
			<TextArea
				className={$cx('article_title', styles.title)}
				value={x.file.data.name}
				autoSize={{ minRows: 1 }}
				onChange={x.onChangeFileName}
				onBlur={x.onBlurFileName}
			></TextArea>
			<Note collection='note_items' setEditor={setEditor}></Note>
		</div>
	)
}

export default new $app.handle(Index).by(observer).by($app.memo).get()
