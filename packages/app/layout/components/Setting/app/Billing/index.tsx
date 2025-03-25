import { useMemoizedFn } from 'ahooks'
import { Button, Segmented } from 'antd'
import { observer } from 'mobx-react-lite'
import { useEffect, useMemo } from 'react'
import { createPortal } from 'react-dom'
import { useTranslation } from 'react-i18next'

import { LoadingCircle } from '@/components'
import { useGlobal } from '@/context/app'
import { is_dev } from '@/utils'
import { CalendarCheck, Check, CheckCircle, Feather, Timer, WifiSlash, X } from '@phosphor-icons/react'

import styles from './index.css'

import type { Iap } from '@/models'

const Index = () => {
	const global = useGlobal()
	const { t } = useTranslation()

	const auth = global.auth
	const iap = global.iap
	const type = iap.type
	const is_infinity = auth?.user?.is_infinity
	const paid_plan = auth?.user?.paid_plan
	const prices = $copy(iap.prices)

	useEffect(() => {
		iap.init()

		return () => iap.off()
	}, [])

	useEffect(() => {
		if (is_infinity) iap.type = 'infinity'
	}, [is_infinity])

	const currency = useMemo(() => (prices['pro'] ? prices['pro'].charAt(0) : '$'), [prices])
	const disconnected = useMemo(() => Object.keys(prices).length === 0, [prices])

	const btn_status = useMemo(() => {
		let text: string
		let billed = false
		let disabled = false

		if (type === 'pro') {
			text = t(`setting.Billing.${paid_plan === 'pro' ? 'upgraded' : 'upgrade'}`)
		} else {
			text = t(`setting.Billing.${is_infinity ? 'purchased' : 'purchase'}`)
		}

		const subscribed = type === 'pro' && paid_plan === 'pro'

		billed = subscribed || (type === 'infinity' && is_infinity)
		disabled = subscribed || is_infinity

		return { text, billed, disabled }
	}, [type, is_infinity, paid_plan])

	const setType = useMemoizedFn((v: Iap['type']) => (iap.type = v))
	const closePay = useMemoizedFn(() => (iap.pay_visible = false))

	const iframe_params = useMemo(() => new URLSearchParams(iap.pay_params as any).toString(), [iap.pay_params])

	if (iap.utils.loading['initPaddle']) {
		return (
			<div className={$cx('w_100 h_100 flex justify_center align_center', styles.loading)}>
				<LoadingCircle></LoadingCircle>
			</div>
		)
	}

	return (
		<div className={$cx('w_100 flex flex_column', styles._local)}>
			<If condition={iap.pay_visible}>
				{createPortal(
					<div
						className={$cx(
							'w_100vw h_100vh fixed top_0 left_0 flex justify_center align_center',
							styles.iframe_wrap
						)}
						style={{ zIndex: 1000000 }}
					>
						<button
							className='btn_close flex justify_center align_center absolute top_0 right_0 clickable'
							onClick={closePay}
						>
							<X weight='bold'></X>
						</button>
						<iframe
							src={`${is_dev ? 'http://localhost:3000' : 'https://if.openages.com'}/pay?${iframe_params}`}
						></iframe>
					</div>,
					document.body
				)}
			</If>
			<If condition={disconnected}>
				<div className={$cx('w_100 h_100 flex flex_column align_center justify_center', styles.empty)}>
					<div className='flex flex_column align_center'>
						<WifiSlash size={90}></WifiSlash>
						<span className='desc text_center mt_6'>{t('iap.err_get_prices')}</span>
						<Button
							className='btn_get_prices mt_12'
							type='text'
							loading={iap.utils.loading['getPrices']}
							onClick={iap.getPrices}
						>
							{t('common.retry')}
						</Button>
					</div>
				</div>
			</If>
			<div className='price_items w_100 border_box flex flex_column'>
				<div className='price_item pro border_box flex flex_column'>
					<div className='header_wrap flex justify_between align_center'>
						<div
							className={$cx(
								'pro_price_wrap flex align_center',
								disconnected && 'disconnected'
							)}
						>
							<Segmented
								className='mr_18'
								options={[
									{
										label: t(`setting.Billing.pro.title`),
										value: 'pro'
									},
									{
										label: t(`setting.Billing.infinity.title`),
										value: 'infinity'
									}
								]}
								disabled={is_infinity}
								value={type}
								onChange={setType}
							></Segmented>
							<div className='price flex align_center'>
								<span className='value mr_2'>
									{prices[type]?.replace('.00', '') || '--'}
								</span>
								{type === 'pro' ? (
									<span className='unit'> / {t(`setting.Billing.unit`)}</span>
								) : (
									<span className='unit'> · {t(`setting.Billing.payonce`)}</span>
								)}
							</div>
						</div>
						<If condition={!disconnected}>
							<Button
								className={$cx('btn_upgrade clickable', btn_status.billed && 'billed')}
								type='primary'
								disabled={btn_status.disabled}
								loading={iap.loading}
								icon={btn_status.billed && <CheckCircle size={16} weight='fill' />}
								onClick={iap.upgrade}
							>
								{btn_status.text}
							</Button>
						</If>
					</div>
					<div className='features border_box flex flex_column'>
						{Array.from({ length: 4 }).map((_, index) => (
							<div className='feature flex align_center' key={index}>
								<Check className='icon_check' weight='bold'></Check>
								<span className='desc'>
									{t(`setting.Billing.pro.items.${index as 0}`)}
								</span>
							</div>
						))}
						{Array.from({ length: 1 }).map((_, index) => (
							<div className='feature flex align_center' key={index}>
								<CheckCircle className='icon_feature' weight='bold'></CheckCircle>
								<span className='desc'>
									{t(`setting.Billing.pro.todo.${index as 0}`)}
								</span>
							</div>
						))}
						{Array.from({ length: 1 }).map((_, index) => (
							<div className='feature flex align_center' key={index}>
								<Feather className='icon_feature' weight='bold'></Feather>
								<span className='desc'>
									{t(`setting.Billing.pro.note.${index as 0}`)}
								</span>
							</div>
						))}
						{Array.from({ length: 1 }).map((_, index) => (
							<div className='feature flex align_center' key={index}>
								<Timer className='icon_feature' weight='bold'></Timer>
								<span className='desc'>
									{t(`setting.Billing.pro.pomo.${index as 0}`)}
								</span>
							</div>
						))}
						{Array.from({ length: 1 }).map((_, index) => (
							<div className='feature flex align_center' key={index}>
								<CalendarCheck className='icon_feature' weight='bold'></CalendarCheck>
								<span className='desc'>
									{t(`setting.Billing.pro.schedule.${index as 0}`)}
								</span>
							</div>
						))}
					</div>
				</div>
				<div className='price_item free border_box flex flex_column'>
					<div className='header_wrap flex justify_between align_center'>
						<h3 className='type'>{t(`setting.Billing.free.title`)}</h3>
						<div className='price'>
							<span className='value'>{currency}0</span>
						</div>
					</div>
					<div className='features border_box flex flex_column'>
						{Array.from({ length: 7 }).map((_, index) => (
							<div className='feature flex align_center' key={index}>
								<Check className='icon_check mr_6' weight='bold'></Check>
								<span className='desc'>
									{t(`setting.Billing.free.items.${index as 0}`)}
								</span>
							</div>
						))}
					</div>
				</div>
			</div>
			<div className='cancel_wrap w_100 border_box flex flex_column'>
				<div className='cancel_item flex flex_column'>
					<span className='title'>{t('common.refund')}</span>
					<span className='content'>{t('iap.refund')}</span>
				</div>
				<div className='cancel_item flex flex_column'>
					<span className='title'>{t('common.unsubscribe')}</span>
					<span className='content'>{t('iap.unsubscribe')}</span>
				</div>
			</div>
		</div>
	)
}

export default new $app.handle(Index).by(observer).by($app.memo).get()
