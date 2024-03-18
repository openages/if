import { useMemoizedFn } from 'ahooks'
import { Item, Menu } from 'react-contexify'
import { useTranslation } from 'react-i18next'

import { Copy, Plus } from '@phosphor-icons/react'

import styles from './index.css'

import type { IPropsCalendarContextMenu } from '../../types'
import type { ItemProps } from 'react-contexify'

const Index = (props: IPropsCalendarContextMenu) => {
	const { timeblock_copied, addTimeBlock } = props
	const { t } = useTranslation()

	const onAddTimeBlock: ItemProps['onClick'] = useMemoizedFn(({ props }) => {
		const { index, row_index, start, length } = props

		onHidden(false)
		addTimeBlock({ index, row_index, start, length })
	})

	const onPasteTimeBlock = useMemoizedFn(({ props }) => {
		const { index, row_index, start, length } = props

		onHidden(false)
		addTimeBlock({ index, row_index, start, length, info: timeblock_copied })
	})

	const onHidden = useMemoizedFn((v: boolean) => {
		if (v) return

		$app.Event.emit('schedule/context_menu/hidden')
	})

	return (
		<Menu id='timeblock_context_menu' className={styles._local} onVisibilityChange={onHidden}>
			<Item onClick={onAddTimeBlock}>
				<div className='menu_item flex align_center'>
					<Plus className='icon mr_6' size={14}></Plus>
					<span className='text'>{t('translation:common.add')}</span>
				</div>
			</Item>
			<Item disabled={!timeblock_copied} onClick={onPasteTimeBlock}>
				<div className='menu_item flex align_center'>
					<Copy className='icon mr_6' size={14}></Copy>
					<span className='text'>{t('translation:common.paste')}</span>
				</div>
			</Item>
		</Menu>
	)
}

export default $app.memo(Index)
