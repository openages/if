import { useMemoizedFn } from 'ahooks'
import { observer } from 'mobx-react-lite'
import { useLayoutEffect, useMemo, useState, Fragment } from 'react'
import { createPortal } from 'react-dom'

import { LazyElement, Modal } from '@/components'
import { useStackSelector } from '@/context/stack'
import { useLexicalComposerContext } from '@lexical/react/LexicalComposerContext'
import { useBasicTypeaheadTriggerMatch, LexicalTypeaheadMenuPlugin } from '@lexical/react/LexicalTypeaheadMenuPlugin'

import { Menu } from './components'
import getOptions from './getOptions'
import Model from './model'

import type Option from './option'
import type { IPropsMenu } from './types'
import type { TypeaheadMenuPluginProps } from '@lexical/react/LexicalTypeaheadMenuPlugin'

const Index = () => {
	const [x] = useState(() => new Model())
	const [editor] = useLexicalComposerContext()
	const id = useStackSelector(v => v.id)

	useLayoutEffect(() => {
		x.init(editor)
	}, [editor])

	const showModal = useMemoizedFn((v: Model['modal']) => (x.modal = v))
	const closeModal = useMemoizedFn(() => (x.modal = ''))
	const setQuery = useMemoizedFn((v: Model['query']) => (x.query = v))
	const onSelectOption = useMemoizedFn(x.onSelectOption)
	const checkForTriggerMatch = useBasicTypeaheadTriggerMatch('/', { minLength: 0 })

	const options = useMemo(() => getOptions(x.query, showModal), [editor, x.query])

	const render: TypeaheadMenuPluginProps<Option>['menuRenderFn'] = useMemoizedFn(
		(anchorElementRef, { selectedIndex, selectOptionAndCleanUp, setHighlightedIndex }) => {
			if (!anchorElementRef.current || !options.length) return null

			const props_menu: IPropsMenu = {
				options,
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
				open={x.modal !== ''}
				title={`Insert ${x.modal}`}
				width={300}
				maskClosable
				onCancel={closeModal}
				getContainer={getModalContainer}
			>
				<LazyElement type='editor_modal' path={x.modal}></LazyElement>
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
