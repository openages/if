import { Popover } from 'antd'
import { Else, If, Then } from 'react-if'

import { EmojiPicker, LeftIcon } from '@/components'

import styles from './index.css'

import type { IPropsCustomFormItem } from '@/types'

const Index = (props: IPropsCustomFormItem<string>) => {
	const { value, onChange } = props

	return (
		<Popover
			rootClassName={styles.icon_picker}
			placement='left'
			trigger='click'
			align={{ offset: [-30, 0] }}
			content={<EmojiPicker onEmojiSelect={({ shortcodes }) => onChange(shortcodes)} />}
		>
			<div className={$cx('border_box flex justify_center align_center clickable', styles._local)}>
				<If condition={value}>
					<Then>
						<em-emoji shortcodes={value} size='24px'></em-emoji>
					</Then>
					<Else>
						<LeftIcon module='todo' item={{ type: 'file', icon: value } as any}></LeftIcon>
					</Else>
				</If>
			</div>
		</Popover>
	)
}

export default $app.memo(Index)
