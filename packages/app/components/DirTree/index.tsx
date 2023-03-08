import { useMemoizedFn } from 'ahooks'
import { observer } from 'mobx-react-lite'
import { useState } from 'react'
import { Else, If, Then, When } from 'react-if'
import { container } from 'tsyringe'

import { useGlobal } from '@/context/app'

import { Actions, DirItem, DragLine, Modal, Search } from './components'
import styles from './index.css'
import Model from './model'

import type { IProps, IPropsActions, IPropsModal } from './types'

const Index = (props: IProps) => {
	const { items, activeItem, height = '100vh', onClick, addFile, addDir } = props
	const [x] = useState(() => container.resolve(Model))
	const global = useGlobal()

	const setModalOpen = useMemoizedFn((v: Model['modal_open'], type?: Model['modal_type']) => {
		x.modal_open = v
		x.modal_type = type || 'file'
	})

	const setFoldAll = useMemoizedFn((v: Model['fold_all']) => (x.fold_all = v))

	const props_actions: IPropsActions = {
		setModalOpen,
		setFoldAll
	}

	const props_modal: IPropsModal = {
		modal_open: x.modal_open,
		modal_type: x.modal_type,
		addFile,
		addDir,
		setModalOpen
	}

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
			<div className='dir_tree_wrap w_100 border_box flex flex_column'>
				<If condition={items?.length}>
					<Then>
						{items.map((item) => (
							<DirItem
								{...item}
								{...{ activeItem, onClick, setFoldAll }}
								fold_all={x.fold_all}
								parent={null}
								key={item.id}
							></DirItem>
						))}
					</Then>
					<Else>
						<div className='empty_wrap w_100 h_100 flex justify_center align_center'>empty</div>
					</Else>
				</If>
			</div>
			<When condition={global.layout.dirtree_width !== 0}>
				<Actions {...props_actions}></Actions>
				<Modal {...props_modal}></Modal>
			</When>
		</div>
	)
}

export default new $app.handle(Index).by(observer).by($app.memo).get()
