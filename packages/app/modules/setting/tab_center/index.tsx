import { toJS } from 'mobx'
import { observer } from 'mobx-react-lite'
import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { Else, If, Then } from 'react-if'
import { container } from 'tsyringe'

import { Emoji, LeftIcon, ModuleIcon } from '@/components'
import { GlobalModel } from '@/context/app'
import { Trash } from '@phosphor-icons/react'

import styles from './index.css'

const Index = () => {
	const [global] = useState(() => container.resolve(GlobalModel))
	const stacks = toJS(global.stack.stacks)
	const { t } = useTranslation()

	return (
		<div className={$cx('w_100 flex flex_column', styles._local)}>
			{stacks.map((item, index) => (
				<div className='app_module_item_wrap w_100 border_box' key={item.id}>
					<div className='app_module_item w_100 border_box flex justify_between align_center'>
						<div className='flex align_center'>
							<If condition={item.file.icon}>
								<Then>
									<Emoji
										shortcodes={item.file.icon}
										size={18}
										hue={item.file.icon_hue}
									></Emoji>
								</Then>
								<Else>
									<LeftIcon
										module={item.module}
										item={item.file}
										size={18}
									></LeftIcon>
								</Else>
							</If>
							<span className='name ml_12'>{item.file.name}</span>
						</div>
						<div className='flex align_center'>
							<ModuleIcon className='mr_4' type={item.module} size={12}></ModuleIcon>
							<span className='module'>{t(`translation:modules.${item.module}`)}</span>
							<div
								className={$cx(
									'btn_wrap flex justify_end align_center ml_12 clickable',
									item.active && 'disabled'
								)}
								onClick={() => global.stack.remove(index)}
							>
								<Trash size={16}></Trash>
							</div>
						</div>
					</div>
				</div>
			))}
		</div>
	)
}

export default new $app.handle(Index).by(observer).by($app.memo).get()
