import { useTranslation } from 'react-i18next'

import { useCopyMemberEmail } from '@/hooks'
import { Check, Infinity, ThumbsUp } from '@phosphor-icons/react'

import { limit, modules } from './data'
import styles from './index.css'

const Index = () => {
	const { t } = useTranslation()
	const { copy } = useCopyMemberEmail()

	return (
		<div className={$cx('w_100 h_100 flex flex_column', styles._local)}>
			<div className='padding_wrap w_100 flex flex_column'>
				<span className='setting_title'>{t('setting.nav.titles.Paid')}</span>
				<div className='price_items w_100 border_box flex justify_center'>
					{Object.keys(limit).map((type: 'free' | 'pro') => (
						<div
							className={$cx('price_item border_box flex flex_column align_center', type)}
							key={type}
						>
							<h3 className='type'>{t(`translation:setting.Paid.${type}.type`)}</h3>
							<div className='price'>
								<span className='value'>
									{t(`translation:setting.Paid.${type}.value`)}
								</span>
								<span className='unit'>/ {t(`translation:setting.Paid.unit`)}</span>
							</div>
							<div className='features flex flex_column'>
								{modules.map(module => (
									<div className='feature flex align_center' key={module}>
										<Check className='icon_check mr_6'></Check>
										<span className='module mr_4'>
											{t(`translation:modules.${module}`)}
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
											{t(`translation:setting.Paid.common.${index as 0}`)}
										</span>
									</div>
								))}
							</div>
							<button className='btn_action w_100 border_box flex justify_center align_center clickable'>
								{t(`translation:setting.Paid.${type}.btn_text`)}
							</button>
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
									{t(`translation:setting.Paid.sponsor.value`)}
								</span>
								<span className='unit'>/ {t(`translation:setting.Paid.unit`)}</span>
							</div>
							<button className='btn_action flex justify_center align_center clickable ml_12'>
								{t('setting.Paid.sponsor.btn_text')}
							</button>
						</div>
					</div>
					<div className='content_wrap w_100 border_box flex flex_column'>
						<div className='rights_wrap content_item w_100 border_box flex flex_column'>
							<span className='title'>{t('setting.Paid.sponsor.title_rights')}</span>
							<ul className='step_items items_wrap'>
								{Array.from({ length: 3 }).map((_, index) => (
									<li className='right_item item' key={index}>
										{t(`translation:setting.Paid.sponsor.rights.${index as 0}`)}
									</li>
								))}
							</ul>
						</div>
						<div className='steps_wrap content_item w_100 border_box flex flex_column'>
							<span className='title'>{t('setting.Paid.sponsor.title_steps')}</span>
							<ol className='step_items items_wrap'>
								{Array.from({ length: 6 }).map((_, index) => (
									<li className='step_item item' key={index}>
										{t(`translation:setting.Paid.sponsor.steps.${index as 0}`)}
									</li>
								))}
							</ol>
						</div>
						<span className='desc'>{t('setting.Paid.sponsor.extra')}</span>
					</div>
				</div>
				<div className='infinity_item w_100 border_box flex flex_column align_center'>
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
				</div>
			</div>
		</div>
	)
}

export default $app.memo(Index)
