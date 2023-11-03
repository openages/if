import { Drawer } from 'antd'
import { useTranslation } from 'react-i18next'

import styles from './index.css'

import type { IPropsHelp } from '../../types'

const Index = (props: IPropsHelp) => {
	const { visible_help_modal, closeHelpModal } = props
      const { t } = useTranslation()
      // @ts-ignore
	const help = t('translation:todo.Help',{ returnObjects: true }) as Array<{ title: string; desc: string }>

	return (
		<Drawer
			rootClassName={$cx('hide_mask custom', styles._local)}
			open={visible_help_modal}
			title={t('translation:todo.Header.options.help')}
			width={300}
			mask={false}
			destroyOnClose
			getContainer={false}
			onClose={closeHelpModal}
		>
			{help.map((item, index) => (
				<div className='help_item w_100 border_box flex flex_column' key={index}>
					<span className='title mb_4'>{item.title}</span>
					<span className='desc'>{item.desc}</span>
				</div>
			))}
		</Drawer>
	)
}

export default $app.memo(Index)
