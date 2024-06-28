import { useMemoizedFn } from 'ahooks'
import { observer } from 'mobx-react-lite'
import { useLayoutEffect, useState } from 'react'

import { Emoji, LeftIcon, ModuleIcon } from '@/components'
import { useLexicalComposerContext } from '@lexical/react/LexicalComposerContext'
import { useLexicalNodeSelection } from '@lexical/react/useLexicalNodeSelection'
import { CheckSquare, Square } from '@phosphor-icons/react'

import styles from './index.css'
import Model from './model'

import type { IPropsRef } from '../types'
import type { App } from '@/types'

const Index = (props: IPropsRef) => {
	const { module, id, node_key } = props
	const [x] = useState(() => new Model())
	const [editor] = useLexicalComposerContext()
	const [selected] = useLexicalNodeSelection(node_key)
	const item = $copy(x.item) || {}

	useLayoutEffect(() => {
		x.init(editor, node_key, module, id)

		return () => x.off()
	}, [editor, node_key, module, id])

	const onClick = useMemoizedFn(x.onEdit)

	return (
		<span
			className={$cx(
				'border_box inline_flex align_center cursor_point clickable',
				styles.component,
				module !== 'file' && styles.is_module,
				selected && styles.selected
			)}
			onClick={onClick}
		>
			<Choose>
				<When condition={module === 'file' && item?.module}>
					<span className='inline_flex justify_center align_center mr_2'>
						<Choose>
							<When condition={!!item.icon}>
								<Emoji shortcodes={item.icon} size={13} hue={item.icon_hue}></Emoji>
							</When>
							<Otherwise>
								<LeftIcon module={item.module} item={item} size={13}></LeftIcon>
							</Otherwise>
						</Choose>
					</span>
					<span className={styles.name}>{item.name}</span>
					<ModuleIcon className={$cx('h_100', styles.module_icon)} type={item.module}></ModuleIcon>
				</When>
				<When condition={module !== 'file'}>
					<Choose>
						<When condition={module === 'todo'}>
							<span className={$cx('inline_flex align_center mr_4', styles.status)}>
								<Choose>
									<When
										condition={
											item.status === 'unchecked' ||
											item.status === 'closed'
										}
									>
										<Square />
									</When>
									<When condition={item.status === 'checked'}>
										<CheckSquare />
									</When>
								</Choose>
							</span>
						</When>
					</Choose>

					<span className={$cx(styles.name)}>{item.text}</span>
					<If condition={module !== 'todo'}>
						<ModuleIcon
							className={$cx('h_100 ml_2', styles.module_icon)}
							type={module as App.ModuleType}
						></ModuleIcon>
					</If>
				</When>
			</Choose>
		</span>
	)
}

export default new $app.handle(Index).by(observer).by($app.memo).get()
