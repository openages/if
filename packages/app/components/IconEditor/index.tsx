import { Popover, Slider } from 'antd'
import { Else, If, Then } from 'react-if'

import { EmojiPicker, LeftIcon, Emoji } from '@/components'

import styles from './index.css'

import type { IPropsCustomFormItem } from '@/types'
import type { DirTree } from '@/types'

interface IProps extends IPropsCustomFormItem<{ icon: string; icon_hue?: number }> {
	left_icon_item?: DirTree.Item
}

const Index = (props: IProps) => {
	const { value = { icon: '', icon_hue: undefined }, left_icon_item, onChange } = props

	return (
		<Popover
			rootClassName={styles.icon_picker}
			placement='left'
			trigger='click'
			destroyTooltipOnHide
			align={{ offset: [-30, 0] }}
			content={
				<div className='flex flex_column'>
					<EmojiPicker
						onEmojiSelect={({ shortcodes }) => onChange({ ...value, icon: shortcodes })}
					/>
					<div className={$cx('border_box flex align_center', styles.hue_wrap)}>
						<span className='hue_label'>色相</span>
						<Slider
							className='hue_slider'
							min={0}
							max={360}
							defaultValue={value.icon_hue}
							onChange={(v: number) => onChange({ ...value, icon_hue: v })}
						></Slider>
					</div>
				</div>
			}
		>
			<div className={$cx('border_box flex justify_center align_center clickable', styles._local)}>
				<If condition={value?.icon}>
					<Then>
						<Emoji shortcodes={value.icon} size={24} hue={value.icon_hue}></Emoji>
					</Then>
					<Else>
						<LeftIcon
							module='todo'
							item={left_icon_item ?? ({ type: 'file', icon: value } as any)}
						></LeftIcon>
					</Else>
				</If>
			</div>
		</Popover>
	)
}

export default $app.memo(Index)
