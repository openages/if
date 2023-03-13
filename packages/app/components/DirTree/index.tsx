import { useMemoizedFn } from 'ahooks'
import { toJS } from 'mobx'
import { observer } from 'mobx-react-lite'
import { useLayoutEffect, useState } from 'react'
import { When } from 'react-if'
import { container } from 'tsyringe'

import { useGlobal } from '@/context/app'

import { Actions, DirItems, DragLine, Modal, Search } from './components'
import styles from './index.css'
import Model from './model'

import type { IProps, IPropsActions, IPropsModal } from './types'
const Index = (props: IProps) => {
	const { module, height = '100vh', onClick } = props
	const [x] = useState(() => container.resolve(Model))
	const global = useGlobal()

	useLayoutEffect(() => {
		x.services.init(module)

		return () => x.services.off()
	}, [module])

	const onItemClick = useMemoizedFn((v: string) => {
		x.current_item = v

		onClick(v)
	})

	const setFoldAll = useMemoizedFn((v: Model['fold_all']) => (x.fold_all = v))

	const setModalOpen = useMemoizedFn((v: Model['services']['modal_open'], type?: Model['modal_type']) => {
		x.services.modal_open = v
		x.modal_type = type || 'file'
      })
      
	const props_dir_items = {
		data: toJS(x.services.doc?.dirtree || []),
		current_item: x.current_item,
		fold_all: x.fold_all,
		onClick: onItemClick,
		setFoldAll
	}

	const props_actions: IPropsActions = {
		setModalOpen,
		setFoldAll
	}

	const props_modal: IPropsModal = {
		modal_open: x.services.modal_open,
		modal_type: x.modal_type,
		add: useMemoizedFn(x.services.add),
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
			<DirItems {...props_dir_items}></DirItems>
			<When condition={global.layout.dirtree_width !== 0}>
				<Actions {...props_actions}></Actions>
				<Modal {...props_modal}></Modal>
			</When>
		</div>
	)
}

export default new $app.handle(Index).by(observer).by($app.memo).get()
