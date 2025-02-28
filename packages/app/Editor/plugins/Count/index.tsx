import { useMemoizedFn } from 'ahooks'
import { Popover as AntdPopover } from 'antd'
import { observer } from 'mobx-react-lite'
import { useLayoutEffect, useMemo, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { container } from 'tsyringe'

import { Popover } from '@/components'
import { useStackSelector } from '@/context/stack'
import { useLexicalComposerContext } from '@lexical/react/LexicalComposerContext'
import { Pulse } from '@phosphor-icons/react'

import styles from './index.css'
import Model from './model'

const Index = () => {
	const [x] = useState(() => container.resolve(Model))
	const [editor] = useLexicalComposerContext()
	const id = useStackSelector(v => v.id)
	const style = $copy(x.style)
	const { t } = useTranslation()

	useLayoutEffect(() => {
		x.init(id, editor)

		return () => x.off()
	}, [id, editor])

	const onChangeCountVisible = useMemoizedFn(v => (x.visible_count_popover = v))

	const CountOptions = useMemo(
		() => (
			<div className={$cx('flex flex_column', styles.count_options)}>
				<div
					className={$cx(
						'option_item w_100 border_box flex justify_between cursor_point',
						x.count_mode === 'total' && 'active'
					)}
					onClick={() => {
						x.count_mode = 'total'

						onChangeCountVisible(false)
					}}
				>
					<span>{t('editor.Count.total')}</span>
					<span className='option_value text_right'>{x.counts_total}</span>
				</div>
				<div
					className={$cx(
						'option_item w_100 border_box flex justify_between cursor_point',
						x.count_mode === 'filted' && 'active'
					)}
					onClick={() => {
						x.count_mode = 'filted'

						onChangeCountVisible(false)
					}}
				>
					<span>{t('editor.Count.filted')}</span>
					<span className='option_value text_right'>{x.counts_filted}</span>
				</div>
			</div>
		),
		[x.count_mode, x.counts_total, x.counts_filted]
	)

	return (
		<Popover
			className={$cx(
				'border_box flex align_center',
				styles._local,
				x.visible_count_popover && styles.active
			)}
			open={x.count && x.visible}
			style={style}
		>
			<AntdPopover
				trigger='click'
				placement='topLeft'
				destroyTooltipOnHide
				content={CountOptions}
				open={x.visible_count_popover}
				onOpenChange={onChangeCountVisible}
			>
				<div>
					<div className='cursor_point flex align_center clickable'>
						<Pulse className='mr_2' size={10}></Pulse>
						{x.count_mode === 'total' ? x.counts_total : x.counts_filted}
					</div>
				</div>
			</AntdPopover>
		</Popover>
	)
}

export default new $app.handle(Index).by(observer).by($app.memo).get()
