import { useEventListener, useFocusWithin, useMemoizedFn } from 'ahooks'
import { debounce } from 'lodash-es'
import { useRef, useState } from 'react'
import { useTranslation } from 'react-i18next'

import { Modal, SimpleEmpty } from '@/components'
import { getDocItem, sleep } from '@/utils'
import { ArrowRight, MagnifyingGlass } from '@phosphor-icons/react'

import styles from './index.css'

import type { IPropsSearch } from '@/layout/types'
import type { MouseEvent } from 'react'

const Index = (props: IPropsSearch) => {
	const { search, searchByInput, onClose, find, add } = props
	const { open, module, items } = search
	const { t } = useTranslation()
	const ref = useRef(null)
	const focusing = useFocusWithin(ref)
	const [compositing, setCompositing] = useState(false)

	useEventListener('compositionstart', () => setCompositing(true), { target: ref })

	useEventListener(
		'compositionend',
		() => {
			setCompositing(false)
			searchByInput(ref.current?.value)
		},
		{ target: ref }
	)

	const onInput = useMemoizedFn(
		debounce(
			({ target: { value } }) => {
				if (compositing) return

				searchByInput(value)
			},
			600,
			{ leading: false }
		)
	)

	const onCheck = useMemoizedFn(async (e: MouseEvent<HTMLDivElement>) => {
		const file_id = (e.target as HTMLDivElement).getAttribute('data-file_id')
		const id = (e.target as HTMLDivElement).getAttribute('data-id')

		if (!file_id) return

		if (!find(file_id).view) {
			const file = await $db.dirtree_items.findOne(file_id).exec()

			add({
				id: file_id,
				module,
				file: getDocItem(file),
				active: true,
				fixed: true
			})

			await sleep(360)
		}

		await $app.Event.emit(`todo/${file_id}/redirect`, id)

		onClose()
	})

	return (
		<Modal className={styles._local} maskClosable width={420} open={open} onCancel={onClose}>
			<div className='flex flex_column'>
				<div className='input_wrap w_100 relative flex align_center'>
					<MagnifyingGlass
						className={$cx('icon_search absolute transition_normal', focusing && 'focusing')}
						size={18}
					></MagnifyingGlass>
					<input
						type='text'
						className='input_search w_100 border_box'
						placeholder={`${t('translation:dirtree.search_placeholder')}${t(
							`translation:modules.${module}`
						)}`}
						autoFocus
						maxLength={30}
						ref={ref}
						onInput={onInput}
					/>
				</div>
				<div className='search_items_wrap w_100 border_box flex flex_column' onClick={onCheck}>
					{items.length > 0 ? (
						items.map(item => (
							<div
								className='search_item w_100 border_box cursor_point transition_normal flex align_center relative'
								data-file_id={item.file_id}
								data-id={item.id}
								key={item.id}
							>
								{item.text}
								<ArrowRight
									className='icon_go absolute right_0'
									weight='bold'
								></ArrowRight>
							</div>
						))
					) : (
						<SimpleEmpty style={{ height: 300 }}></SimpleEmpty>
					)}
				</div>
			</div>
		</Modal>
	)
}

export default $app.memo(Index)
