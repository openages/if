import { Emoji, LeftIcon } from '@/components'
import { App } from '@/types'
import { Star } from '@phosphor-icons/react'

import styles from './index.css'

import type { IPropsHomepageFiles } from '@/layout/types'

const Index = (props: IPropsHomepageFiles) => {
	const { tab, files, setStar, onFile } = props

	return (
		<div className={$cx('w_100 border_box flex', styles._local)}>
			<div className='file_items w_100 flex flex_column'>
				{files.map(item => (
					<div
						className='file_item w_100 border_box flex align_center cursor_point'
						onClick={() => onFile(item)}
						key={item.id}
					>
						<div className='left_icon_wrap flex justify_center align_center'>
							<Choose>
								<When condition={!!item.icon}>
									<Emoji
										shortcodes={item.icon!}
										size={16}
										hue={item.icon_hue}
									></Emoji>
								</When>
								<Otherwise>
									<LeftIcon
										module={item.module as App.ModuleType}
										item={item}
									></LeftIcon>
								</Otherwise>
							</Choose>
						</div>
						<div className='title_wrap flex align_center'>{item.name}</div>
						<If condition={tab === 'star'}>
							<div
								className='star_icon_wrap none align_center clickable'
								onClick={e => {
									e.stopPropagation()

									setStar(item.id)
								}}
							>
								<Star size={12} weight='fill' />
							</div>
						</If>
					</div>
				))}
			</div>
		</div>
	)
}

export default $app.memo(Index)
