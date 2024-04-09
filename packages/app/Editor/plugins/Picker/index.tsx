import { useMemoizedFn } from 'ahooks'
import { observer } from 'mobx-react-lite'
import { useMemo, useState, Fragment } from 'react'
import { createPortal } from 'react-dom'

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

	const checkForTriggerMatch = useBasicTypeaheadTriggerMatch('/', { minLength: 0 })

	const showModal = useMemoizedFn((v: Model['modal']) => (x.modal = v))
	const closeModal = useMemoizedFn(() => (x.modal = ''))
	const setQuery = useMemoizedFn((v: Model['query']) => (x.query = v))

	const options = useMemo(() => getOptions(x.query, showModal), [editor, x.query])

	const onSelectOption = useMemoizedFn(x.onSelectOption)

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

	return (
		<Fragment>
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
