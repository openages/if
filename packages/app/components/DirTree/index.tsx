import { useMemoizedFn } from 'ahooks'
import { toJS } from 'mobx'
import { observer } from 'mobx-react-lite'
import { useLayoutEffect, useState } from 'react'
import { useContextMenu } from 'react-contexify'
import { When } from 'react-if'
import { container } from 'tsyringe'

import { useGlobal } from '@/context/app'
import { useDeepMemo } from '@matrixages/knife/react'

import { Actions, DirItems, DragLine, Modal, Options, Search } from './components'
import styles from './index.css'
import Model from './model'

import type { IProps, IPropsActions, IPropsModal, IPropsDirItems, IPropsOptions } from './types'
import type { DirTree } from '@/types'

const Index = (props: IProps) => {
	const { module, height = '100vh', onClick } = props
	const [x] = useState(() => container.resolve(Model))
	const global = useGlobal()
	const { show } = useContextMenu({ id: 'dirtree_options' })
	const dirtree = useDeepMemo(() => x.services.doc?.toMutableJSON?.().dirtree || [], [x.services.doc.dirtree])

	useLayoutEffect(() => {
		x.init(module)
	}, [module])

	const onItemClick = useMemoizedFn((v: string) => {
		x.current_item = v

		onClick(v)
	})

	const setFoldAll = useMemoizedFn((v: Model['fold_all']) => (x.fold_all = v))

	const setModalOpen = useMemoizedFn((v: Model['modal_open'], type?: Model['modal_type']) => {
		x.focusing_item = {} as DirTree.Item
		x.modal_open = v
		x.modal_type = type || 'file'
	})

	const showDirTreeOptions = useMemoizedFn((e, v) => {
		x.focusing_item = v

		show({ event: e })
	})

	const props_dir_items: IPropsDirItems = {
		module: x.services.module,
		data: dirtree,
		current_item: x.current_item,
		fold_all: x.fold_all,
		onClick: onItemClick,
		setFoldAll,
		showDirTreeOptions
	}

	const props_actions: IPropsActions = {
		setModalOpen,
		setFoldAll
	}

	const props_modal: IPropsModal = {
		modal_open: x.modal_open,
		modal_type: x.modal_type,
		current_option: x.current_option,
		focusing_item: toJS(x.focusing_item),
		add: useMemoizedFn(x.add),
		setModalOpen,
		resetFocusingItem: () => {
			x.current_option = ''
			x.focusing_item = {} as DirTree.Item
		},
		rename: useMemoizedFn(x.rename)
	}

	const props_options: IPropsOptions = {
		focusing_item: toJS(x.focusing_item),
		onOptions: useMemoizedFn(x.onOptions)
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
			<Options {...props_options}></Options>
		</div>
	)
}

export default new $app.handle(Index).by(observer).by($app.memo).get()
