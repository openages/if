import { useMemoizedFn, useUpdate } from 'ahooks'
import { observer } from 'mobx-react-lite'
import { useLayoutEffect, useState, Fragment } from 'react'
import { createPortal } from 'react-dom'
import smoothScrollIntoView from 'smooth-scroll-into-view-if-needed'

import { Popover } from '@/components'
import { useGlobal } from '@/context/app'
import { useStackSelector } from '@/context/stack'
import { useLexicalComposerContext } from '@lexical/react/LexicalComposerContext'
import { TableOfContentsPlugin } from '@lexical/react/LexicalTableOfContentsPlugin'
import { GpsFix } from '@phosphor-icons/react'

import { Item } from './Components'
import styles from './index.css'
import Model from './model'

interface IPropsToc {
	setItems: (v: Model['items']) => void
}

interface IPropsContent {
	items: Model['items']
	minimize: Model['minimize']
	scroll: Model['scroll']
	style: Model['style']
	toc: Model['toc']
	visible_items: Array<string>
	active_items: Array<string>
	setRef: (v: HTMLElement) => void
	scrollIntoEl: (node_key: string) => void
}

const Toc = $app.memo(({ setItems }: IPropsToc) => {
	return (
		<TableOfContentsPlugin>
			{items => {
				setItems(items)

				return null
			}}
		</TableOfContentsPlugin>
	)
})

const Content = $app.memo((props: IPropsContent) => {
	const { items, minimize, scroll, style, toc, visible_items, active_items, setRef, scrollIntoEl } = props

	return (
		<div
			className={$cx(
				'border_box',
				styles._local,
				!minimize ? 'fixed z_index_10' : styles.minimize,
				!minimize && toc !== 'default' && styles.visible
			)}
			style={!minimize ? style : {}}
		>
			<div
				className={$cx('nav_list_wrap h_100 border_box flex relative', !scroll && 'align_center')}
				ref={setRef}
			>
				<ul className='nav_list w_100 relative'>
					<div className='right_mask absolute right_0 h_100'></div>
					{items.map(([node_key, text, type]) => (
						<Item
							{...{ type, text, node_key, scrollIntoEl }}
							visible={visible_items.includes(node_key)}
							active={active_items.includes(node_key)}
							key={node_key}
						></Item>
					))}
				</ul>
			</div>
		</div>
	)
})

const Index = () => {
	const [x] = useState(() => new Model())
	const [editor] = useLexicalComposerContext()
	const id = useStackSelector(v => v.id)
	const global = useGlobal()
	const update = useUpdate()
	const items = $copy(x.items)
	const page_width = global.setting.page_width

	useLayoutEffect(() => {
		x.init(id, editor, page_width)

		return () => x.off()
	}, [id, editor, page_width])

	const setItems = useMemoizedFn(v => {
		x.items = v

		setTimeout(() => update(), 0)
	})
	const setRef = useMemoizedFn(v => (x.ref = v))

	const scrollIntoEl = useMemoizedFn((node_key: string) => {
		smoothScrollIntoView(editor.getElementByKey(node_key))
	})

	const props_content: IPropsContent = {
		minimize: x.minimize,
		scroll: x.scroll,
		items,
		style: $copy(x.style),
		toc: $copy(x.toc),
		visible_items: $copy(x.visible_items),
		active_items: $copy(x.active_items),
		setRef,
		scrollIntoEl
	}

	const onToggleMiniNav = useMemoizedFn(() => (x.visible_mini_nav = !x.visible_mini_nav))

	if (x.toc === 'hidden') return null

	if ((page_width === '100%' || x.minimize) && props_content.style) {
		const Button = (
			<Fragment>
				<div
					className={$cx(
						'border_box fixed z_index_100 flex justify_center align_center clickable',
						styles.btn_nav,
						x.visible_mini_nav && styles.active,
						!items.length && 'none'
					)}
					style={props_content.style}
					onClick={onToggleMiniNav}
				>
					<GpsFix></GpsFix>
				</div>
				<Toc setItems={setItems}></Toc>
				<Popover
					className={styles.mini_nav}
					open={x.visible_mini_nav}
					style={{ left: (props_content.style.left as number) - 162, bottom: 24 + 18 + 9 }}
					updatePosition={x.getPosition}
				>
					<Content {...props_content} />
				</Popover>
			</Fragment>
		)

		return createPortal(Button, document.getElementById(id))
	}

	return createPortal(
		<Fragment>
			<Toc setItems={setItems}></Toc>
			<Content {...props_content} />
		</Fragment>,
		document.getElementById(id)
	)
}

export default new $app.handle(Index).by(observer).by($app.memo).get()
