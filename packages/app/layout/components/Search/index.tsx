import { useMemoizedFn } from 'ahooks'
import { useRef, Fragment } from 'react'
import { useTranslation } from 'react-i18next'

import { Modal, SimpleEmpty } from '@/components'
import { ArrowBendDownLeft, ArrowDown, ArrowUp, Trash } from '@phosphor-icons/react'

import Input from './components/Input'
import Result from './components/Result'
import styles from './index.css'

import type { IPropsSearch, IPropsSearchInput, IPropsSearchInputRef, IPropsSearchResult } from '@/layout/types'
import type { MouseEvent } from 'react'

const Index = (props: IPropsSearch) => {
	const {
		open,
		module,
		items,
		index,
		history,
		setModule,
		searchByInput,
		onClose,
		onCheck,
		changeSearchIndex,
		clearSearchHistory
	} = props
	const { t } = useTranslation()
	const ref = useRef<IPropsSearchInputRef>(null)

	const props_search_input: IPropsSearchInput = {
		search_ref: ref,
		module,
		items,
		index,
		setModule,
		searchByInput,
		onClose,
		onCheck,
		changeSearchIndex,
		clearSearchHistory
	}

	const props_search_result: IPropsSearchResult = {
		module,
		items,
		index,
		text: ref.current?.text!,
		onCheck,
		changeSearchIndex
	}

	const onSearchItem = useMemoizedFn((e: MouseEvent<HTMLDivElement>) => {
		const target = e.target as HTMLDivElement
		const text = target.getAttribute('data-text')

		if (!text) return
		if (!ref.current) return

		ref.current.input.value = text

		searchByInput(text)
		ref.current.setText(text)
	})

	return (
		<Modal
			className={styles.wrap}
			bodyClassName={styles._local}
			maskClosable
			disableOverflow
			width={420}
			zIndex={2000}
			open={open}
			onCancel={onClose}
		>
			<div className='flex flex_column'>
				<Input {...props_search_input}></Input>
				<div className='search_items_wrap w_100 border_box flex flex_column'>
					{items.length > 0 ? (
						<Result {...props_search_result}></Result>
					) : (
						<Fragment>
							{history.length > 0 && (
								<div className='search_history w_100 flex flex_column'>
									<div className='search_history_header flex justify_between align_center'>
										<span className='title'>{t('app.search.history')}</span>
										<div
											className='btn_clear flex justify_center align_center clickable'
											onClick={clearSearchHistory}
										>
											<Trash size={14}></Trash>
										</div>
									</div>
									<div className='flex flex_wrap' onClick={onSearchItem}>
										{history.map((item, index) => (
											<span
												className='search_history_item mr_4 cursor_point clickable'
												data-text={item}
												key={index}
											>
												{item}
											</span>
										))}
									</div>
								</div>
							)}
							<SimpleEmpty style={{ height: 300 }}></SimpleEmpty>
						</Fragment>
					)}
				</div>
				<div className='hotkey_wrap w_100 border_box flex justify_between align_center'>
					<div className='flex align_center'>
						<div className='key_item flex align_center mr_18'>
							<div className='icon_key_wrap border_box flex justify_center align_center'>
								<ArrowUp></ArrowUp>
							</div>
							<div className='icon_key_wrap border_box flex justify_center align_center'>
								<ArrowDown></ArrowDown>
							</div>
							<span className='desc'>{t('app.search.to_navigate')}</span>
						</div>
						<div className='key_item flex align_center'>
							<div className='icon_key_wrap border_box flex justify_center align_center'>
								<ArrowBendDownLeft></ArrowBendDownLeft>
							</div>
							<span className='desc'>{t('app.search.to_select')}</span>
						</div>
					</div>
					<div className='flex align_center'>
						<div className='key_item flex align_center'>
							<div className='icon_key_wrap esc_wrap border_box flex justify_center align_center'>
								<span className='esc'>esc</span>
							</div>
							<span className='desc'>{t('app.search.to_close')}</span>
						</div>
					</div>
				</div>
			</div>
		</Modal>
	)
}

export default $app.memo(Index)
