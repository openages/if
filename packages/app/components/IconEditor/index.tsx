import { useClickAway, useMemoizedFn } from 'ahooks'
import { Popover, Slider } from 'antd'
import { useRef, useState } from 'react'
import { useTranslation } from 'react-i18next'

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
      const [open,setOpen]=useState(false)
      const ref_trigger=useRef(null)
      const ref_content=useRef(null)

      useClickAway(() => setOpen(false), [ref_trigger, ref_content]);

      const onOpenChange=useMemoizedFn((v:boolean)=>{
            if(v) setOpen(v)
      })

      const onEmojiSelect=useMemoizedFn(({ shortcodes }) => {
            onChange!({ ...value, icon: shortcodes })
            setOpen(false)
      })

      const onHueChange=useMemoizedFn((v: number) => onChange!({ ...value, icon_hue: v }))

	return (
		<Popover
			rootClassName={styles.icon_picker}
			placement={center ? 'left' : 'leftBottom'}
			trigger='click'
                  open={open}
			destroyTooltipOnHide
			getPopupContainer={() => document.body}
			align={{ offset: [-30, center ? 0 : -58] }}
			zIndex={100000}
                  onOpenChange={onOpenChange}
			content={
				<div className='flex flex_column' ref={ref_content}
                        >
					<EmojiPicker
						onEmojiSelect={onEmojiSelect}
					/>
					<div className={$cx('border_box flex align_center', styles.hue_wrap)}>
						<span className='hue_label'>{t('components.IconEditor.hue')}</span>
						<Slider
							className='hue_slider'
							min={0}
							max={360}
							defaultValue={value.icon_hue}
							onChange={onHueChange}
						></Slider>
					</div>
				</div>
			}
		>
			<div ref={ref_trigger}>
				<div className={$cx('border_box flex justify_center align_center clickable', styles._local)}>
					<Choose>
						<When condition={!!value?.icon}>
							<Emoji shortcodes={value.icon} size={24} hue={value.icon_hue}></Emoji>
						</When>
						<Otherwise>
							<LeftIcon
								module={module}
								item={left_icon_item ?? ({ type: 'file', icon: value } as any)}
							></LeftIcon>
						</Otherwise>
					</Choose>
				</div>
			</div>
		</Popover>
	)
}

export default $app.memo(Index)
