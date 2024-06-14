import { useMemoizedFn } from 'ahooks'
import { $getRoot, $getSelection, $isRangeSelection } from 'lexical'
import { observer } from 'mobx-react-lite'
import { useLayoutEffect, useMemo, useState, Fragment } from 'react'
import { createPortal } from 'react-dom'
import { useTranslation } from 'react-i18next'

import { LazyElement, LoadingCircle, Modal } from '@/components'
import { useStackSelector } from '@/context/stack'
import { $getMatchingParent } from '@/Editor/utils'
import { useLexicalComposerContext } from '@lexical/react/LexicalComposerContext'
import { useBasicTypeaheadTriggerMatch, LexicalTypeaheadMenuPlugin } from '@lexical/react/LexicalTypeaheadMenuPlugin'

import getOptions from '../../options'
import { $isTableNode } from '../Table/utils'
import { Menu } from './components'
import config from './config'
import styles from './index.css'
import Model from './model'

import type Option from './option'
import type { IPropsMenu } from './types'
import type { IPropsModal } from '../../types'
import type { TypeaheadMenuPluginProps } from '@lexical/react/LexicalTypeaheadMenuPlugin'
import type { RangeSelection } from 'lexical'

const Index = () => {
	const [x] = useState(() => new Model())
	const [editor] = useLexicalComposerContext()
	const id = useStackSelector(v => v.id)
	const { t } = useTranslation()

	useLayoutEffect(() => {
		x.init(editor)

		return () => x.off()
	}, [editor])

	const showModal = useMemoizedFn(x.show)
	const closeModal = useMemoizedFn(x.close)
	const setQuery = useMemoizedFn((v: Model['query']) => (x.query = v))
	const onSelectOption = useMemoizedFn(x.onSelectOption)
	const checkForTriggerMatch = useBasicTypeaheadTriggerMatch('/', { minLength: 0 })

	const options = useMemo(() => getOptions({ query_string: x.query, editor, showModal }), [editor, x.query])

	const render: TypeaheadMenuPluginProps<Option>['menuRenderFn'] = useMemoizedFn(
		(anchorElementRef, { selectedIndex, selectOptionAndCleanUp, setHighlightedIndex }) => {
			if (!anchorElementRef.current || !options.length) return null

			const excludes = editor.getEditorState().read(() => {
				const selection = $getSelection()

				if (!$isRangeSelection(selection)) return

				const excludes = []
				const anchor = selection.anchor.getNode()

				if ($getMatchingParent(anchor, $isTableNode)) excludes.push('tb')
				// if (!$getRoot().is(anchor?.getParent?.()?.getParent?.())) excludes.push('nav')

				return excludes
			})

			let target: Array<Option> = options

			if (excludes) target = options.filter(item => !excludes.includes(item.shortcut))

			const props_menu: IPropsMenu = {
				options: target,
				selected_index: selectedIndex,
				selectOptionAndCleanUp,
				setHighlightedIndex
			}

			return createPortal(<Menu {...props_menu}></Menu>, anchorElementRef.current)
		}
	)

	const getModalContainer = useMemoizedFn(() => document.getElementById(id))

	return (
		<Fragment>
			<Modal
				className={$cx(styles.modal, x.modal && styles[x.modal])}
				open={x.modal !== ('' as Model['modal'])}
				title={`${t(x.node_key ? 'translation:common.update' : 'translation:editor.insert')}${t(
					'translation:common.letter_space'
				)}${t(`translation:editor.name.${x.modal}`)}`}
				width={config[x.modal]?.width || 300}
				maskClosable
				onCancel={closeModal}
				getContainer={getModalContainer}
			>
				<LazyElement
					type='editor_modal'
					placeholder={
						<div className='w_100 flex justify_center align_center' style={{ height: 180 }}>
							<LoadingCircle></LoadingCircle>
						</div>
					}
					path={x.modal}
					props={{ node_key: x.node_key, onClose: closeModal } as IPropsModal}
				></LazyElement>
			</Modal>
			<LexicalTypeaheadMenuPlugin
				options={options}
				menuRenderFn={render}
				onQueryChange={setQuery}
				onSelectOption={onSelectOption}
				triggerFn={checkForTriggerMatch}
			/>
		</Fragment>
	)
}

export default new $app.handle(Index).by(observer).by($app.memo).get()
