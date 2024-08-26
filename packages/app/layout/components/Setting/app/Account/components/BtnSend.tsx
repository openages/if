import { useMemoizedFn, useReactive } from 'ahooks'
import { Button } from 'antd'
import { useRef } from 'react'
import { useTranslation } from 'react-i18next'

import type { IPropsBtnSend } from '../types'
import type { MouseEvent } from 'react'

const Index = (props: IPropsBtnSend) => {
	const { loading, sendVCode } = props
	const { t } = useTranslation()
	const x = useReactive({ disabled: false, time: 0 })
	const timer = useRef<NodeJS.Timer>()

	const send = useMemoizedFn(async (e: MouseEvent<HTMLButtonElement>) => {
		e.stopPropagation()

		const res = await sendVCode()

		if (res === false) return

		startTimer()
	})

	const startTimer = useMemoizedFn(() => {
		x.disabled = true
		x.time = 30

		timer.current = setInterval(() => {
			if (x.time === 0) {
				clearInterval(timer.current)
				x.disabled = false

				return
			}

			x.time--
		}, 1000)
	})

	return (
		<Button
			className={$cx('btn_send absolute cursor_point border_box clickable', x.disabled && 'disabled')}
			loading={loading}
			onClick={send}
		>
			<If condition={!loading}>
				{x.disabled ? t('app.auth.resend_captcha', { time: x.time }) : t('app.auth.send_captcha')}
			</If>
		</Button>
	)
}

export default $app.memo(Index)
