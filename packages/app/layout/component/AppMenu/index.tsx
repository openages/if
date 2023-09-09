import { useMemoizedFn } from 'ahooks'
import { Modal, Carousel } from 'antd'
import { chunk } from 'lodash-es'
import { useRef } from 'react'
import { useTranslation } from 'react-i18next'
import { Link } from 'react-router-dom'

import { ModuleIcon } from '@/components'

import styles from './index.css'

import type { IPropsAppMenu } from '../../types'
import type { CarouselRef } from 'antd/lib/carousel'
import type { WheelEventHandler } from 'react'

const Index = (props: IPropsAppMenu) => {
	const { visible, app_modules, actives, onClose } = props
	const { t } = useTranslation()
	const carousel = useRef<CarouselRef>(null)

	const onWheel: WheelEventHandler<HTMLDivElement> = useMemoizedFn((e) => {
		if (e.deltaY > 0) {
			carousel.current.next()
		} else {
			carousel.current.prev()
		}
	})

	return (
		<Modal
			rootClassName={styles._local}
			open={visible}
			width={360}
			zIndex={10000}
			centered
			closeIcon={null}
			footer={null}
			onCancel={onClose}
		>
			<div className='w_100' onWheel={onWheel}>
				<Carousel ref={carousel} waitForAnimate>
					{chunk(app_modules, 9).map((modules, index) => (
						<div key={index}>
							<div className='menu_items_wrap w_100 border_box flex flex_wrap'>
								{modules.map((item) => (
									<Link
										className={$cx(
											'menu_item_wrap border_box',
											actives.find((i) => i.app === item.title) && 'active'
										)}
										key={item.title}
										to={item.path}
										onClick={onClose}
									>
										<div className='menu_item w_100 border_box flex flex_column align_center'>
											<ModuleIcon
												type={item.title}
												size={42}
												weight='duotone'
											></ModuleIcon>
											<span className='app_name'>
												{t(`translation:modules.${item.title}`)}
											</span>
										</div>
									</Link>
								))}
							</div>
						</div>
					))}
				</Carousel>
			</div>
		</Modal>
	)
}

export default $app.memo(Index)
