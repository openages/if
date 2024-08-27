import { useTranslation } from 'react-i18next'

import styles from './index.css'

import type { IPropsDayExtra } from '../../types'
import type { Extra } from '../../utils/getDayDetails'

const Index = (props: IPropsDayExtra) => {
	const { item } = props
	const { i18n } = useTranslation()
	const is_zh = i18n.language === 'zh'

	return (
		<div className={$cx((item.global_festival || is_zh) && 'ml_6', styles._local)}>
			<Choose>
				<When condition={!!item.global_festival}>
					<span className='holiday'>{item.global_festival}</span>
				</When>
				<Otherwise>
					<If condition={is_zh}>
						<Choose>
							<When condition={!!item.extra}>
								<div className='extra_wrap flex align_center'>
									<Choose>
										<When condition={(item.extra as Extra).target}>
											<span className='holiday'>
												{(item.extra as Extra).holiday}
											</span>
										</When>
										<Otherwise>
											<Choose>
												<When condition={(item.extra as Extra).work}>
													<span className='status work'>班</span>
												</When>
												<Otherwise>
													<span className='status relax'>休</span>
												</Otherwise>
											</Choose>
										</Otherwise>
									</Choose>
								</div>
							</When>
							<Otherwise>
								<span className='lunar'>{item.lunar}</span>
							</Otherwise>
						</Choose>
					</If>
				</Otherwise>
			</Choose>
		</div>
	)
}

export default $app.memo(Index)
