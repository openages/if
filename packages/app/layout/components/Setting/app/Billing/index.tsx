import { useMemoizedFn } from 'ahooks'
import { Button, Segmented } from 'antd'
import { observer } from 'mobx-react-lite'
import { useEffect, useMemo } from 'react'
import { useTranslation } from 'react-i18next'

import { useGlobal } from '@/context/app'
import { CalendarCheck, Check, CheckCircle, MarkdownLogo, Timer, WifiSlash } from '@phosphor-icons/react'

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
		if (is_infinity) iap.type = 'infinity'
	}, [is_infinity])

	const currency = useMemo(() => (prices['pro'] ? prices['pro'].charAt(0) : '$'), [prices])

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

	if (Object.keys(prices).length === 0) {
		return (
			<div className={$cx('w_100 h_100 flex flex_column align_center justify_center', styles.empty)}>
				<div className='flex flex_column align_center'>
					<WifiSlash size={90}></WifiSlash>
					<span className='desc mt_6'>{t('app.no_data')}</span>
				</div>
			</div>
		)
	}

	return (
		<div className={$cx('w_100 flex flex_column', styles._local)}>
			<div className='price_items w_100 border_box flex flex_column'>
				<div className='price_item pro border_box flex flex_column'>
					<div className='header_wrap flex justify_between align_center'>
						<div className='flex align_center'>
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
								<span className='value mr_2'>{prices[type]?.replace('.00', '')}</span>
								{type === 'pro' ? (
									<span className='unit'> / {t(`setting.Billing.unit`)}</span>
								) : (
									<span className='unit'> · {t(`setting.Billing.payonce`)}</span>
								)}
							</div>
						</div>
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
								<MarkdownLogo className='icon_feature' weight='bold'></MarkdownLogo>
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
		</div>
	)
}

export default new $app.handle(Index).by(observer).by($app.memo).get()
