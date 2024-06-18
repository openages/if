import { useMemoizedFn } from 'ahooks'
import { observer } from 'mobx-react-lite'
import { useLayoutEffect, useState, Fragment } from 'react'
import { createPortal } from 'react-dom'
import smoothScrollIntoView from 'smooth-scroll-into-view-if-needed'

import { Popover } from '@/components'
import { useStackSelector } from '@/context/stack'
import { useLexicalComposerContext } from '@lexical/react/LexicalComposerContext'
import { TableOfContentsPlugin } from '@lexical/react/LexicalTableOfContentsPlugin'
import { GpsFix } from '@phosphor-icons/react'

import { Item } from './Components'
import styles from './index.css'
import Model from './model'

interface IPropsContent {
	minimize: Model['minimize']
	scroll: Model['scroll']
	style: Model['style']
	visible_items: Array<string>
	active_items: Array<string>
	setRef: (v: HTMLElement) => void
	setItems: (v: Model['items']) => void
	scrollIntoEl: (node_key: string) => void
}

const Content = $app.memo((props: IPropsContent) => {
	const { minimize, scroll, style, visible_items, active_items, setRef, setItems, scrollIntoEl } = props

	return (
		<TableOfContentsPlugin>
			{items => {
				setItems(items)

				if (!items.length) return null

				return (
					<div
						className={$cx(
							'border_box',
							styles._local,
							!minimize ? 'fixed z_index_10' : styles.minimize
						)}
						style={!minimize ? style : {}}
					>
						<div
							className={$cx(
								'nav_list_wrap h_100 border_box flex relative',
								!scroll && 'align_center'
							)}
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
			}}
		</TableOfContentsPlugin>
	)
})

const Index = () => {
	const [x] = useState(() => new Model())
	const [editor] = useLexicalComposerContext()
	const id = useStackSelector(v => v.id)

	useLayoutEffect(() => {
		x.init(id, editor)

		return () => x.off()
	}, [id, editor])

	const setItems = useMemoizedFn(v => (x.items = v))
	const setRef = useMemoizedFn(v => (x.ref = v))

	const scrollIntoEl = useMemoizedFn((node_key: string) => {
		smoothScrollIntoView(editor.getElementByKey(node_key))
	})

	const props_content: IPropsContent = {
		minimize: x.minimize,
		scroll: x.scroll,
		style: $copy(x.style),
		visible_items: $copy(x.visible_items),
		active_items: $copy(x.active_items),
		setRef,
		setItems,
		scrollIntoEl
	}

	const onToggleMiniNav = useMemoizedFn(() => (x.visible_mini_nav = !x.visible_mini_nav))

	if (x.minimize) {
		const Button = (
			<Fragment>
				<div
					className={$cx(
						'fixed z_index_10 flex justify_center align_center clickable',
						styles.btn_nav,
						x.visible_mini_nav && styles.active
					)}
					style={props_content.style}
					onClick={onToggleMiniNav}
				>
					<GpsFix></GpsFix>
				</div>
				<Popover
					className={styles.mini_nav}
					open={x.visible_mini_nav}
					style={{ left: (props_content.style.left as number) - 150, bottom: 21 + 18 + 3 }}
					updatePosition={x.getPosition}
				>
					<Content {...props_content} />
				</Popover>
			</Fragment>
		)

		return createPortal(Button, document.getElementById(id))
	}

	return createPortal(<Content {...props_content} />, document.getElementById(id))
}

export default new $app.handle(Index).by(observer).by($app.memo).get()
