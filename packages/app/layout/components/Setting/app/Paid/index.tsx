import { useMemoizedFn } from 'ahooks'
import { Button } from 'antd'
import { observer } from 'mobx-react-lite'
import { useMemo } from 'react'
import { useTranslation } from 'react-i18next'

import { plan_level } from '@/appdata'
import { useGlobal } from '@/context/app'
import { useCopyMemberEmail } from '@/hooks'
import { getObjectKeys } from '@/utils'
import { Check, Infinity, ThumbsUp, WifiSlash } from '@phosphor-icons/react'

import { limit, modules } from './data'
import styles from './index.css'

import type { Iap } from '@/types'
import type { Iap as IapModel } from '@/models'

const Index = () => {
	const global = useGlobal()
	const { t } = useTranslation()
	const { copy } = useCopyMemberEmail()

	const iap = global.iap
	const user = $copy(global.auth.user)
	const products = $copy(iap.products)

	const user_level = useMemo(() => plan_level.get(user.paid_plan)!, [user.paid_plan])
	const currency = useMemo(() => (products['PRO'] ? products['PRO'].formattedPrice.charAt(0) : '$'), [products])

	const purchase = useMemoizedFn((plan: Iap.Plan) => {
		if (!global.auth.user.id) {
			$message.info(t('app.not_login'))

			$app.Event.emit('global.setting.goLogin')

			return
		}

		iap.current = plan.toLowerCase() as IapModel['current']

		iap.purchase(products[plan].productIdentifier)
	})

	if (Object.keys(products).length === 0) {
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
		<div className={$cx('w_100 h_100 flex flex_column', styles._local)}>
			<div className='padding_wrap w_100 flex flex_column'>
				<span className='setting_title'>{t('setting.nav.titles.Paid')}</span>
				<div className='price_items w_100 border_box flex justify_center'>
					{getObjectKeys(limit).map((type: 'free' | 'pro') => (
						<div
							className={$cx('price_item border_box flex flex_column align_center', type)}
							key={type}
						>
							<h3 className='type'>{t(`setting.Paid.${type}.type`)}</h3>
							<div className='price'>
								<Choose>
									<When condition={type == 'pro'}>
										<span className='value'>
											{products['PRO'].formattedPrice.replace('.00', '')}
										</span>
									</When>
									<Otherwise>
										<span className='value'>{currency}0</span>
									</Otherwise>
								</Choose>
								<span className='unit'>/ {t(`setting.Paid.unit`)}</span>
							</div>
							<div className='features flex flex_column'>
								{modules.map(module => (
									<div className='feature flex align_center' key={module}>
										<Check className='icon_check mr_6'></Check>
										<span className='module mr_4'>
											{t(`modules.${module}`)}
										</span>
										<div className='count flex align_center mr_4'>
											{limit[type][module] === 'unlimited' ? (
												<Infinity size={15} weight='bold'></Infinity>
											) : (
												limit[type][module]
											)}
										</div>
										<span className='desc'>{t('setting.Paid.file')}</span>
									</div>
								))}
								{Array.from({ length: 4 }).map((_, index) => (
									<div className='feature flex align_center' key={index}>
										<Check className='icon_check mr_6'></Check>
										<span className='desc'>
											{t(`setting.Paid.common.${index as 0}`)}
										</span>
									</div>
								))}
							</div>
							<Choose>
								<When condition={type !== 'free'}>
									<Button
										className={$cx(
											'btn_action w_100 border_box flex justify_center align_center clickable',
											((user_level > 0 &&
												user_level >= plan_level.get(type)!) ||
												(iap.current && iap.current !== type)) &&
												'disabled'
										)}
										type='primary'
										loading={
											iap.current === type && iap.utils.loading['purchase']
										}
										onClick={() => purchase(type.toUpperCase() as Iap.Plan)}
									>
										{t(`setting.Paid.${type}.btn_text`)}
									</Button>
								</When>
								<Otherwise>
									<Button
										className='btn_action w_100 border_box flex justify_center align_center clickable'
										type='default'
									>
										{t(`setting.Paid.${type}.btn_text`)}
									</Button>
								</Otherwise>
							</Choose>
						</div>
					))}
				</div>
				<div className='sponsor_item w_100 border_box flex flex_column align_center'>
					<div className='header_wrap w_100 border_box flex justify_between align_center'>
						<div className='flex align_center'>
							<div className='icon_wrap flex justify_center align_center mr_12'>
								<ThumbsUp size={27} weight='duotone'></ThumbsUp>
							</div>
							<h3 className='type'>{t('setting.Paid.sponsor.type')}</h3>
						</div>
						<div className='flex align_center'>
							<div className='price'>
								<span className='value'>
									{products['SPONSOR'].formattedPrice.replace('.00', '')}
								</span>
								<span className='unit'>/ {t(`setting.Paid.unit`)}</span>
							</div>
						</div>
					</div>
					<div className='content_wrap w_100 border_box flex flex_column'>
						<Button
							className={$cx(
								'btn_action mt_12 mb_18 flex justify_center align_center clickable',
								(user_level >= plan_level.get('sponsor')! ||
									(iap.current && iap.current !== 'sponsor')) &&
									'disabled'
							)}
							type='primary'
							loading={iap.current === 'sponsor' && iap.utils.loading['purchase']}
							onClick={() => purchase('SPONSOR')}
						>
							{t('setting.Paid.sponsor.btn_text')}
						</Button>
						<div className='rights_wrap content_item w_100 border_box flex flex_column'>
							<span className='title'>{t('setting.Paid.sponsor.title_rights')}</span>
							<ul className='step_items items_wrap'>
								{Array.from({ length: 3 }).map((_, index) => (
									<li className='right_item item' key={index}>
										{t(`setting.Paid.sponsor.rights.${index as 0}`)}
									</li>
								))}
							</ul>
						</div>
						<div className='steps_wrap content_item w_100 border_box flex flex_column'>
							<span className='title'>{t('setting.Paid.sponsor.title_steps')}</span>
							<ol className='step_items items_wrap'>
								{Array.from({ length: 6 }).map((_, index) => (
									<li className='step_item item' key={index}>
										{t(`setting.Paid.sponsor.steps.${index as 0}`)}
									</li>
								))}
							</ol>
						</div>
						<span className='desc'>{t('setting.Paid.sponsor.extra')}</span>
					</div>
				</div>
				{/* <div className='infinity_item w_100 border_box flex flex_column align_center'>
					<div className='header_wrap w_100 border_box flex justify_between align_center'>
						<div className='flex align_center'>
							<div className='icon_wrap flex justify_center align_center mr_12'>
								<Infinity size={30} weight='duotone'></Infinity>
							</div>
							<h3 className='type'>{t('setting.Paid.infinity.type')}</h3>
						</div>
						<a
							className='btn_join flex justify_center align_center clickable'
							href='mailto:if.member@openages.com'
							onClick={copy}
						>
							{t('setting.Paid.infinity.join')}
						</a>
					</div>
					<span className='desc w_100 border_box'>{t('setting.Paid.infinity.extra')}</span>
				</div> */}
			</div>
		</div>
	)
}

export default new $app.handle(Index).by(observer).by($app.memo).get()
