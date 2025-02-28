import { useEventListener, useMemoizedFn } from 'ahooks'
import { Select } from 'antd'
import { debounce } from 'lodash-es'
import { observer } from 'mobx-react-lite'
import { useRef, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { container } from 'tsyringe'

import { SimpleEmpty } from '@/components'
import { useStackEffect } from '@/hooks'
import { useLexicalComposerContext } from '@lexical/react/LexicalComposerContext'
import { MagnifyingGlass } from '@phosphor-icons/react'

import { Files, Items, ModuleTab } from './components'
import styles from './index.css'
import Model from './model'
import { options_search_type } from './modules'

import type { IPropsModal } from '../../types'
import type { IPropsModuleTab, IPropsFiles, IPropsItems } from './types'

const Index = (props: IPropsModal) => {
	const { node_key, onClose } = props
	const [x] = useState(() => container.resolve(Model))
	const [editor] = useLexicalComposerContext()
	const { t } = useTranslation()
	const ref = useRef<HTMLInputElement>(null)

	const { setDom } = useStackEffect({
		mounted: () => x.init(editor, node_key!),
		unmounted: () => x.off(),
		deps: [editor, node_key]
	})

	useEventListener('compositionstart', () => (x.compositing = true), { target: ref })

	useEventListener(
		'compositionend',
		() => {
			x.compositing = false

			x.search(ref.current?.value!)
		},
		{ target: ref }
	)

	const onItem = useMemoizedFn((v, index) => {
		x.onItem(v, index)

		onClose()
	})

	const props_module_tab: IPropsModuleTab = {
		module: x.module,
		onChangeModule: useMemoizedFn(v => {
			x.onChangeModule(v)

			if (ref.current?.value) ref.current.value = ''
		})
	}

	const props_files: IPropsFiles = {
		module: x.module,
		latest_files: $copy(x.latest_files),
		search_mode: x.search_mode,
		onItem
	}

	const props_items: IPropsItems = {
		module: x.module,
		latest_items: $copy(x.latest_items),
		search_mode: x.search_mode,
		onItem
	}

	const onInput = useMemoizedFn(
		debounce(({ target: { value } }) => {
			if (x.compositing) return

			x.search(value)
		}, 600)
	)

	const onChangeSearchType = useMemoizedFn(v => {
		x.search_type = v

		if (ref.current?.value) ref.current.value = ''
	})

	return (
		<div className={$cx('w_100 flex flex_column', styles._local)} ref={setDom}>
			<ModuleTab {...props_module_tab}></ModuleTab>
			<div className='input_search_wrap w_100 flex align_center relative'>
				<input
					className='input_search w_100 border_box'
					placeholder={t('common.search')}
					maxLength={30}
					ref={ref}
					onInput={onInput}
				></input>
				<MagnifyingGlass className='icon_search absolute' size={18}></MagnifyingGlass>
				{!x.only_files && (
					<Select
						className='search_type no_suffix absolute'
						popupClassName='small'
						size='small'
						variant='borderless'
						value={x.search_type}
						options={options_search_type}
						onChange={onChangeSearchType}
					></Select>
				)}
			</div>
			<div
				className={$cx(
					'w_100 flex justify_between',
					styles.content,
					(x.only_files || x.search_mode) && styles.only_files
				)}
			>
				<If condition={!x.search_mode}>
					<If condition={!x.only_files}>
						<Items {...props_items}></Items>
					</If>
					<Files {...props_files}></Files>
				</If>
				<If condition={x.search_mode}>
					<If condition={x.search_type === 'file'}>
						<If condition={props_files.latest_files.length > 0}>
							<Files {...props_files}></Files>
						</If>
						<If condition={!props_files.latest_files.length}>
							<SimpleEmpty className='empty'></SimpleEmpty>
						</If>
					</If>
					<If condition={x.search_type === 'item'}>
						<If condition={props_items.latest_items.length > 0}>
							<Items {...props_items}></Items>
						</If>
						<If condition={!props_items.latest_items.length}>
							<SimpleEmpty className='empty'></SimpleEmpty>
						</If>
					</If>
				</If>
			</div>
		</div>
	)
}

export default new $app.handle(Index).by(observer).by($app.memo).get()
