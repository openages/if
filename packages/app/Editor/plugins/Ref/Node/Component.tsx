import { useMemoizedFn } from 'ahooks'
import { observer } from 'mobx-react-lite'
import { useMemo, useState } from 'react'

import { ModuleIcon } from '@/components'
import { useCreateLayoutEffect } from '@/hooks'
import { getEditorText } from '@/utils/editor'
import { useLexicalComposerContext } from '@lexical/react/LexicalComposerContext'
import { useLexicalNodeSelection } from '@lexical/react/useLexicalNodeSelection'
import { CheckSquare, Square } from '@phosphor-icons/react'

import styles from './index.css'
import Model from './model'

import type { IPropsRef } from '../types'
import type { App } from '@/types'

const text_modules = ['todo', 'schedule']

const Index = (props: IPropsRef) => {
	const { module, id, node_key } = props
	const [x] = useState(() => new Model())
	const [editor] = useLexicalComposerContext()
	const [selected] = useLexicalNodeSelection(node_key!)
	const item = $copy(x.item) || {}

	useCreateLayoutEffect(() => {
		x.init(editor, node_key!, module, id)

		return () => x.off()
	}, [editor, node_key, module, id])

	const text = useMemo(() => {
		if (!item.text) return ''

		if (text_modules.includes(module)) {
			return getEditorText(item.text)
		}

		return item.text
	}, [module, item.text])

	const onClick = useMemoizedFn(x.onEdit)

	return (
		<span
			className={$cx(
				'border_box inline_flex align_center relative cursor_point clickable',
				styles.component,
				module !== 'file' && styles.is_module,
				selected && styles.selected,
				!x.item && styles.removed
			)}
			onClick={x.item ? onClick : undefined}
		>
			<Choose>
				<When condition={item?.module && module === 'file'}>
					<ModuleIcon
						className={$cx('h_100 absolute left_0', styles.file_icon)}
						type={item.module}
						weight='fill'
					></ModuleIcon>
					<span className={styles.name}>{item?.name || id}</span>
				</When>
				<When condition={module !== 'file'}>
					<If condition={module === 'todo'}>
						<Choose>
							<When condition={item.status}>
								<span
									className={$cx(
										'inline_flex align_center absolute left_0',
										styles.status
									)}
								>
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
							<Otherwise>
								<ModuleIcon className='h_100 absolute left_0' type='todo'></ModuleIcon>
							</Otherwise>
						</Choose>
					</If>
					<If condition={module !== 'todo'}>
						<ModuleIcon
							className='h_100 absolute left_0'
							type={module as App.ModuleType}
						></ModuleIcon>
					</If>
					<span className={$cx(styles.name)}>{text || id}</span>
				</When>
			</Choose>
		</span>
	)
}

export default new $app.handle(Index).by(observer).by($app.memo).get()
