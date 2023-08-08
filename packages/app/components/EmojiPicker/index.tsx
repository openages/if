import { observer } from 'mobx-react-lite'
import { useMemo } from 'react'

import { useGlobal } from '@/context/app'
import data from '@emoji-mart/data'
import i18n_en from '@emoji-mart/data/i18n/en.json'
import i18n_zh from '@emoji-mart/data/i18n/zh.json'
import Picker from '@emoji-mart/react'

interface IProps {
	onEmojiSelect: (v: string) => void
}

const Index = (props: IProps) => {
	const { onEmojiSelect } = props
	const global = useGlobal()

	const i18n = useMemo(() => {
		const map = {
			'en-US': i18n_en,
			'zh-CN': i18n_zh
		}

		return map[global.locale.lang]
	}, [global.locale.lang])

	return (
		<Picker
			data={data}
			i18n={i18n}
			theme={global.setting.theme}
			previewPosition='none'
			dynamicWidth
			onEmojiSelect={onEmojiSelect}
		/>
	)
}

export default new $app.handle(Index).by(observer).by($app.memo).get()
