import { useMemoizedFn } from 'ahooks'
import { observer } from 'mobx-react-lite'
import { useLayoutEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'

import { useLexicalComposerContext } from '@lexical/react/LexicalComposerContext'
import { MagnifyingGlass } from '@phosphor-icons/react'

import { Files, Items, ModuleTab } from './components'
import styles from './index.css'
import Model from './model'

import type { IPropsModal } from '../../types'
import type { IPropsModuleTab, IPropsFiles, IPropsItems } from './types'

const Index = (props: IPropsModal) => {
	const [x] = useState(() => new Model())
	const { onClose } = props
	const [editor] = useLexicalComposerContext()
	const { t } = useTranslation()

	useLayoutEffect(() => {
		x.init(editor)
	}, [editor])

	const onItem = useMemoizedFn(x.onItem)

	const props_module_tab: IPropsModuleTab = {
		module: x.module,
		onChangeModule: useMemoizedFn(x.onChangeModule)
	}

	const props_files: IPropsFiles = {
		latest_files: $copy(x.latest_files),
		onItem
	}

	const props_items: IPropsItems = {
		latest_items: $copy(x.latest_items),
		onItem
	}

	return (
		<div className={$cx('w_100 flex flex_column', styles._local)}>
			<ModuleTab {...props_module_tab}></ModuleTab>
			<div className='input_search_wrap w_100 flex align_center relative'>
				<input
					className='input_search w_100 border_box'
					placeholder={t('translation:common.search')}
				></input>
				<MagnifyingGlass className='icon_search absolute' size={18}></MagnifyingGlass>
			</div>
			<div className={$cx('w_100 flex justify_between', styles.content)}>
				<Items {...props_items}></Items>
				<Files {...props_files}></Files>
			</div>
		</div>
	)
}

export default new $app.handle(Index).by(observer).by($app.memo).get()
