import { Popover, Slider } from 'antd'
import { useTranslation } from 'react-i18next'
import { Else, If, Then } from 'react-if'

import { Emoji, EmojiPicker, LeftIcon } from '@/components'

import styles from './index.css'

import type { IPropsCustomFormItem } from '@/types'
import type { DirTree, App } from '@/types'

interface IProps extends IPropsCustomFormItem<{ icon: string; icon_hue?: number }> {
	module: App.ModuleType
	left_icon_item?: DirTree.Item
	center?: boolean
}

const Index = (props: IProps) => {
	const { value = { icon: '', icon_hue: undefined }, module, left_icon_item, center, onChange } = props
	const { t } = useTranslation()

	return (
		<Popover
			rootClassName={styles.icon_picker}
			placement={center ? 'left' : 'leftBottom'}
			trigger='click'
			destroyTooltipOnHide
			getPopupContainer={() => document.body}
			align={{ offset: [-30, center ? 0 : -58] }}
			zIndex={100000}
			content={
				<div className='flex flex_column'>
					<EmojiPicker
						onEmojiSelect={({ shortcodes }) => onChange({ ...value, icon: shortcodes })}
					/>
					<div className={$cx('border_box flex align_center', styles.hue_wrap)}>
						<span className='hue_label'>{t('translation:components.IconEditor.hue')}</span>
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
			<div>
				<div className={$cx('border_box flex justify_center align_center clickable', styles._local)}>
					<If condition={value?.icon}>
						<Then>
							<Emoji shortcodes={value.icon} size={24} hue={value.icon_hue}></Emoji>
						</Then>
						<Else>
							<LeftIcon
								module={module}
								item={left_icon_item ?? ({ type: 'file', icon: value } as any)}
							></LeftIcon>
						</Else>
					</If>
				</div>
			</div>
		</Popover>
	)
}

export default $app.memo(Index)
