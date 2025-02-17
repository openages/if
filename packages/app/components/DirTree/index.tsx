import { useMemoizedFn } from 'ahooks'
import { observer } from 'mobx-react-lite'
import { useLayoutEffect, useState } from 'react'
import { useContextMenu } from 'react-contexify'
import { createPortal } from 'react-dom'
import { container } from 'tsyringe'

import { useGlobal } from '@/context/app'

import { Actions, DirItems, DragLine, Modal, Options, Search } from './components'
import styles from './index.css'
import Model from './model'

import type { Extend } from '@/types'
import type { IProps, IPropsSearch, IPropsActions, IPropsDirItems, IPropsModal, IPropsOptions } from './types'

const Index = (props: IProps) => {
	const { module, actions, height = '100vh' } = props
	const [x] = useState(() => container.resolve(Model))
	const global = useGlobal()
	const dirtree_width = global.layout.dirtree_width
	const browser_mode = global.setting.browser_mode

	const { show } = useContextMenu({ id: 'dirtree_options' })

	useLayoutEffect(() => {
		x.init({ module, actions })

		return () => x.off()
	}, [module])

	const setModalOpen = useMemoizedFn(async (v: Model['modal_open'], type?: Model['modal_type']) => {
		x.focusing_index = []
		x.modal_open = v
		x.modal_type = type || 'file'
		x.current_option = `add_${type || 'file'}`
	})

	const showDirTreeOptions = useMemoizedFn((e, v) => {
		x.focusing_index = v

		show({ event: e })
	})

	const resetFocusingItem = useMemoizedFn(() => {
		x.current_option = ''
		x.focusing_index = []
	})

	const props_search: IPropsSearch = {
		showSearch: useMemoizedFn(() => $app.Event.emit('global.app.showSearch'))
	}

	const props_dir_items: IPropsDirItems = {
		module: x.module,
		data: ($copy(x.node_tree.tree) as Extend.DirTree.TransformedItems) || [],
		loading: x.utils.loading['query'],
		current_item: $copy(x.current_item),
		focusing_item: $copy(x.focusing_item),
		open_folder: $copy(x.open_folder),
		browser_mode,
		star_ids: global.app.star_files.map(item => item.id),
		onClick: useMemoizedFn(v => {
			if (browser_mode) $app.Event.emit('global.app.toggleHomepage')

			x.onClick(v)
		}),
		onStar: useMemoizedFn(global.app.setStar),
		showDirTreeOptions
	}

	const props_actions: IPropsActions = {
		setModalOpen
	}

	const props_modal: IPropsModal = {
		module: x.module,
		modal_open: x.modal_open,
		modal_type: x.modal_type,
		current_option: x.current_option,
		focusing_item: $copy(x.focusing_item),
		loading_create: x.utils.loading['insert'],
		loading_updateItem: x.utils.loading['updateItem'],
		insert: useMemoizedFn(x.insert),
		update: useMemoizedFn(x.update),
		setModalOpen,
		resetFocusingItem
	}

	const props_options: IPropsOptions = {
		focusing_item: $copy(x.focusing_item),
		onOptions: useMemoizedFn(x.onOptions),
		resetFocusingItem
	}

	return (
		<div
			className={$cx(
				'border_box relative',
				styles._local,
				dirtree_width === 0 && styles.hide,
				browser_mode && styles.browser_mode
			)}
			style={browser_mode ? { width: '100%', height: '100%' } : { width: dirtree_width, height }}
		>
			<If condition={dirtree_width !== 0 && !browser_mode}>
				<Search {...props_search}></Search>
			</If>
			<If condition={!browser_mode}>
				<DragLine></DragLine>
			</If>
			<DirItems {...props_dir_items}></DirItems>
			<If condition={dirtree_width !== 0}>
				<Actions {...props_actions}></Actions>
				<Modal {...props_modal}></Modal>
			</If>
			{createPortal(<Options {...props_options}></Options>, document.body)}
		</div>
	)
}

export default new $app.handle(Index).by(observer).by($app.memo).get()
