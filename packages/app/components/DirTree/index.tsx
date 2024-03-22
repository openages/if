import { useMemoizedFn } from 'ahooks'
import { Popover } from 'antd'
import { observer } from 'mobx-react-lite'
import { useLayoutEffect, useState } from 'react'
import { useContextMenu } from 'react-contexify'
import { createPortal } from 'react-dom'
import { container } from 'tsyringe'

import { useGlobal } from '@/context/app'
import { useDeepMemo } from '@openages/stk/react'
import { List, X } from '@phosphor-icons/react'

import { Actions, DirItems, DragLine, Modal, Options, Search } from './components'
import styles from './index.css'
import Model from './model'

import type { Extend } from '@/types'
import type { MouseEvent } from 'react'
import type {
	IProps,
	IPropsContent,
	IPropsSearch,
	IPropsActions,
	IPropsDirItems,
	IPropsModal,
	IPropsOptions
} from './types'

const Content = $app.memo((props: IPropsContent) => {
	const {
		dirtree_width,
		simple,
		height,
		props_search,
		props_dir_items,
		props_actions,
		props_modal,
		props_options
	} = props

	return (
		<div
			className={$cx(
				'border_box relative',
				styles._local,
				!simple && dirtree_width === 0 && styles.hide,
				simple && styles.simple
			)}
			style={!simple ? { width: dirtree_width, height } : {}}
		>
			<If condition={!simple && dirtree_width !== 0}>
				<Search {...props_search}></Search>
			</If>
			<If condition={!simple}>
				<DragLine></DragLine>
			</If>
			<DirItems {...props_dir_items}></DirItems>
			<If condition={!simple ? dirtree_width !== 0 : true}>
				<Actions {...props_actions}></Actions>
				<If condition={!simple}>
					<Modal {...props_modal}></Modal>
				</If>
			</If>
			{createPortal(<Options {...props_options}></Options>, document.body)}
		</div>
	)
})

const Index = (props: IProps) => {
	const { module, actions, height = '100vh', simple } = props
	const [x] = useState(() => container.resolve(Model))

	const global = useGlobal()

	const { show } = useContextMenu({ id: 'dirtree_options' })

	useLayoutEffect(() => {
		x.init({ module, actions, simple })

		return () => x.off()
	}, [module, simple])

	const setModalOpen = useMemoizedFn((v: Model['modal_open'], type?: Model['modal_type']) => {
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
		onClick: useMemoizedFn(x.onClick),
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

	const onOpenChange = useMemoizedFn((v: boolean | MouseEvent<HTMLButtonElement>) => {
		if (!v) return

		x.open_dirtree = typeof v === 'boolean' ? v : false
	})

	const props_content: IPropsContent = {
		dirtree_width: global.layout.dirtree_width,
		simple,
		height,
		props_search,
		props_dir_items,
		props_actions,
		props_modal,
		props_options
	}

	const Target = useDeepMemo(() => {
		return (
			<Popover
				open={x.open_dirtree}
				trigger='click'
				fresh
				destroyTooltipOnHide
				zIndex={1000}
				arrow={false}
				autoAdjustOverflow={false}
				placement='topLeft'
				align={{ offset: [0, -6] }}
				getPopupContainer={() => document.body}
				content={<Content {...props_content} />}
				onOpenChange={onOpenChange}
			>
				<div className={$cx('fixed', styles.btn_dirtree)}>
					<button
						className='btn_dirtree flex justify_center align_center clickable'
						onClick={onOpenChange}
					>
						{x.open_dirtree ? <X size={15}></X> : <List size={15}></List>}
					</button>
					<Modal {...props_modal}></Modal>
				</div>
			</Popover>
		)
	}, [x.open_dirtree, props_content])

	if (simple) return Target

	return <Content {...props_content} />
}

export default new $app.handle(Index).by(observer).by($app.memo).get()
