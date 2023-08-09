import { useMemoizedFn } from 'ahooks'
import { toJS } from 'mobx'
import { observer } from 'mobx-react-lite'
import { useEffect, useLayoutEffect, useState } from 'react'
import { useContextMenu } from 'react-contexify'
import { createPortal } from 'react-dom'
import { When } from 'react-if'
import { container } from 'tsyringe'

import { useGlobal } from '@/context/app'

import { Actions, DirItems, DragLine, Modal, Options, Search } from './components'
import styles from './index.css'
import Model from './model'

import type { IProps, IPropsActions, IPropsModal, IPropsDirItems, IPropsOptions } from './types'
import type { DirTree } from '@/types'

const Index = (props: IProps) => {
	const { module, height = '100vh' } = props
	const [x] = useState(() => container.resolve(Model))
	const global = useGlobal()
	const { show } = useContextMenu({ id: 'dirtree_options' })

	useLayoutEffect(() => {
		x.init(module)

		return () => x.off()
	}, [module])

	useEffect(() => {
		if (x.current_item) props.onClick(x.current_item)
	}, [x.current_item])

	const onClick = useMemoizedFn((v: string) => (x.current_item = v))

	const setModalOpen = useMemoizedFn((v: Model['modal_open'], type?: Model['modal_type']) => {
		x.focusing_item = {} as DirTree.Item
		x.modal_open = v
		x.modal_type = type || 'file'
		x.current_option = `add_${type || 'file'}`
	})

	const showDirTreeOptions = useMemoizedFn((e, v) => {
		x.focusing_item = v

		show({ event: e })
	})

	const resetFocusingItem = useMemoizedFn(() => {
		x.current_option = ''
		x.focusing_item = {} as DirTree.Item
	})

	const props_dir_items: IPropsDirItems = {
		module: x.module,
		data: toJS(x.services.dirtree),
		current_item: x.current_item,
		focusing_item: toJS(x.focusing_item),
		onClick,
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
		focusing_item: toJS(x.focusing_item),
		loading_add: toJS(x.utils.loading['add']),
		loading_rename: toJS(x.utils.loading['rename']),
		add: useMemoizedFn(x.add),
		setModalOpen,
		resetFocusingItem,
		rename: useMemoizedFn(x.rename)
	}

	const props_options: IPropsOptions = {
		focusing_item: toJS(x.focusing_item),
		onOptions: useMemoizedFn(x.onOptions),
		resetFocusingItem
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
			{createPortal(<Options {...props_options}></Options>, document.body)}
		</div>
	)
}

export default new $app.handle(Index).by(observer).by($app.memo).get()
