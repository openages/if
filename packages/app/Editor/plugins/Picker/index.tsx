import { useMemoizedFn } from 'ahooks'
import { $getSelection, $isRangeSelection } from 'lexical'
import { observer } from 'mobx-react-lite'
import { useLayoutEffect, useMemo, useState, Fragment } from 'react'
import { createPortal } from 'react-dom'
import { useTranslation } from 'react-i18next'
import { container } from 'tsyringe'

import { LazyElement, LoadingCircle, Modal } from '@/components'
import { useStackSelector } from '@/context/stack'
import { $getMatchingParent } from '@/Editor/utils'
import { useLexicalComposerContext } from '@lexical/react/LexicalComposerContext'
import { useBasicTypeaheadTriggerMatch, LexicalTypeaheadMenuPlugin } from '@lexical/react/LexicalTypeaheadMenuPlugin'

import getOptions from '../../options'
import { $isQuoteNode } from '../Quote/utils'
import { $isTableNode } from '../Table/utils'
import { $isToggleBodyNode, $isToggleHeadNode } from '../Toggle/utils'
import { Menu } from './components'
import config from './config'
import styles from './index.css'
import Model from './model'

import type Option from './option'
import type { IPropsMenu, IProps } from './types'
import type { IPropsModal } from '../../types'
import type { TypeaheadMenuPluginProps } from '@lexical/react/LexicalTypeaheadMenuPlugin'

const Index = (props: IProps) => {
	const { text_mode, linebreak } = props
	const [x] = useState(() => container.resolve(Model))
	const [editor] = useLexicalComposerContext()
	const id = useStackSelector(v => v.id)
	const { t } = useTranslation()

	useLayoutEffect(() => {
		x.init(editor, text_mode!)

		return () => x.off()
	}, [editor, text_mode])

	const showModal = useMemoizedFn(x.show)
	const closeModal = useMemoizedFn(x.close)
	const setQuery = useMemoizedFn((v: Model['query'] | null) => (x.query = v || ''))
	const onSelectOption = useMemoizedFn(x.onSelectOption)
	const checkForTriggerMatch = useBasicTypeaheadTriggerMatch('/', { minLength: 0 })

	const options = useMemo(() => {
		const target = getOptions({ query_string: x.query, editor, text_mode, linebreak, showModal })

		if (!x.query) x.options = target

		return target
	}, [editor, x.query, text_mode])

	const render: TypeaheadMenuPluginProps<Option>['menuRenderFn'] = useMemoizedFn(
		(ref, { selectedIndex, selectOptionAndCleanUp, setHighlightedIndex }) => {
			if (!ref.current || !options.length) return null

			const excludes = editor.getEditorState().read(() => {
				const selection = $getSelection()

				if (!$isRangeSelection(selection)) return

				const excludes = []
				const anchor = selection.anchor.getNode()

				if ($getMatchingParent(anchor, $isTableNode)) {
					excludes.push(...['tb', 'qt', 'nav'])
				}

				if ($getMatchingParent(anchor, $isQuoteNode)) {
					excludes.push(...['qt', 'tb', 'dv', 'cat'])
				}

				if ($getMatchingParent(anchor, $isToggleHeadNode)) {
					excludes.push(
						...['img', 'cd', 'ul', 'ol', 'tl', 'dv', 'tg', 'tb', 'qt', 'nav', 'ktx', 'mmd']
					)
				}

				if ($getMatchingParent(anchor, $isToggleBodyNode)) {
					excludes.push(...['qt', 'cat', 'tg'])
				}

				return excludes
			})

			let target: Array<Option> = options
			let target_latest: Array<number> = $copy(x.latest_blocks)

			if (!text_mode && excludes) {
				target = options.filter(item => !excludes.includes(item.shortcut))
				target_latest = target_latest.filter(item => !excludes.includes(x.options[item].shortcut))
			}

			const props_menu: IPropsMenu = {
				all_options: x.options,
				latest_blocks: target_latest,
				options: target,
				selected_index: selectedIndex!,
				text_mode,
				selectOptionAndCleanUp,
				setHighlightedIndex
			}

			return createPortal(<Menu {...props_menu}></Menu>, ref.current)
		}
	)

	const getModalContainer = useMemoizedFn(() => document.getElementById(id)!)

	const modal_title = useMemo(() => {
		if (x.modal === 'Ref') return

		return `${t(x.node_key ? 'common.update' : 'editor.insert')}${t(
			'common.letter_space'
		)}${t(`editor.name.${x.modal}`)}`
	}, [x.modal, x.node_key])

	const width = useMemo(() => config[x.modal as keyof typeof config]?.width || 300, [x.modal])

	return (
		<Fragment>
			<Modal
				bodyClassName={$cx(styles.modal, x.modal && styles[x.modal])}
				open={x.modal !== ('' as Model['modal'])}
				title={modal_title}
				width={width}
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
				showOnTop={text_mode}
				menuRenderFn={render}
				onQueryChange={setQuery}
				onSelectOption={onSelectOption}
				triggerFn={checkForTriggerMatch}
			/>
		</Fragment>
	)
}

export default new $app.handle(Index).by(observer).by($app.memo).get()
