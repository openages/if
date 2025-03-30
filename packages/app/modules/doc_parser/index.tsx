import { useMemoizedFn } from 'ahooks'
import { observer } from 'mobx-react-lite'
import { useState } from 'react'
import { useDropzone } from 'react-dropzone'
import { container } from 'tsyringe'

import { support_tomd } from '@/appdata'
import { LoadingCircle } from '@/components'
import { useStackEffect } from '@/hooks'
import { FileArrowUp } from '@phosphor-icons/react'

import { Actions, Viewer } from './components'
import styles from './index.css'
import Model from './model'

import type { IPropsViewer } from './types'

const Index = () => {
	const [x] = useState(() => container.resolve(Model))

	const { setDom } = useStackEffect({
		mounted: () => x.init(),
		unmounted: () => x.off(),
		deps: [],
		stack_id: '__doc_parser__'
	})

	const { getRootProps, getInputProps } = useDropzone({
		multiple: true,
		accept: { 'text/html': support_tomd },
		onDrop: x.onDrop
	})

	const root_props = getRootProps()
	const input_props = getInputProps()

	const props_viewer: IPropsViewer = {
		mds: $copy(x.mds),
		onChangeMd: useMemoizedFn(x.onChangeMd),
		onRemove: useMemoizedFn(x.onRemove)
	}

	const save = useMemoizedFn(x.save)

	return (
		<div
			className={$cx('w_100 h_100 border_box flex', styles._local, x.mds.length && styles.show_viewer)}
			ref={setDom}
		>
			<div className='upload_wrap h_100 flex justify_center align_center relative'>
				<div
					className='upload flex flex_column flex justify_center align_center clickable relative'
					{...root_props}
				>
					<If condition={x.loading}>
						<div className='loading_wrap flex justify_center align_center w_100 h_100 absolute'>
							<LoadingCircle></LoadingCircle>
						</div>
					</If>
					<input {...input_props} />
					<FileArrowUp className='icon' weight='thin'></FileArrowUp>
					<div className='support_files w_100 border_box flex flex_wrap justify_center align_center'>
						{support_tomd.map(item => (
							<span className='file_item' key={item}>
								{item}
							</span>
						))}
						<span>to .md</span>
					</div>
				</div>
				<If condition={x.mds.length > 0}>
					<Actions save={save}></Actions>
				</If>
			</div>
			<If condition={x.mds.length > 0}>
				<Viewer {...props_viewer}></Viewer>
			</If>
		</div>
	)
}

export default new $app.handle(Index).by(observer).by($app.memo).get()
