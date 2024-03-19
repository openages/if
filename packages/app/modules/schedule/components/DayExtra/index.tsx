import { useTranslation } from 'react-i18next'
import { Else, If, Then, When } from 'react-if'

import styles from './index.css'

import type { IPropsDayExtra } from '../../types'

const Index = (props: IPropsDayExtra) => {
	const { item } = props
	const { i18n } = useTranslation()
	const is_zh = i18n.language === 'zh'

	return (
		<div className={$cx((item.global_festival || is_zh) && 'ml_6', styles._local)}>
			<If condition={item.global_festival}>
				<Then>
					<span className='holiday'>{item.global_festival}</span>
				</Then>
				<Else>
					<When condition={is_zh}>
						<If condition={!!item.extra}>
							<Then>
								<div className='extra_wrap flex align_center'>
									<If condition={item.extra.target}>
										<Then>
											<span className='holiday'>{item.extra.holiday}</span>
										</Then>
										<Else>
											<If condition={item.extra.work}>
												<Then>
													<span className='status work'>班</span>
												</Then>
												<Else>
													<span className='status relax'>休</span>
												</Else>
											</If>
										</Else>
									</If>
								</div>
							</Then>
							<Else>
								<span className='lunar'>{item.lunar}</span>
							</Else>
						</If>
					</When>
				</Else>
			</If>
		</div>
	)
}

export default $app.memo(Index)
