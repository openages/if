import { useMemoizedFn } from 'ahooks'
import { Popover as AntdPopover } from 'antd'
import { observer } from 'mobx-react-lite'
import { useLayoutEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { container } from 'tsyringe'

import { Popover } from '@/components'
import { useStackSelector } from '@/context/stack'
import { useLexicalComposerContext } from '@lexical/react/LexicalComposerContext'
import { DotsThreeCircle } from '@phosphor-icons/react'

import styles from './index.css'
import Model from './model'
import Options from './Options'

import type { IPropsOptions } from './types'

const Index = () => {
	const [x] = useState(() => container.resolve(Model))
	const [editor] = useLexicalComposerContext()
	const id = useStackSelector(v => v.id)
	const style = $copy(x.style)
	const { t } = useTranslation()

	useLayoutEffect(() => {
		x.init(id, editor)

		return () => x.off()
	}, [id, editor])

	const onChangeCountVisible = useMemoizedFn(v => (x.visible_options = v))

	const props_options: IPropsOptions = {
		exportMd: useMemoizedFn(() => editor.update(() => x.exportMd())),
		importMd: useMemoizedFn(x.importMd)
	}

	return (
		<Popover
			className={$cx(
				'border_box flex align_center',
				styles._local,
				x.visible_options && styles.visible_options
			)}
			open={true}
			style={style}
		>
			<AntdPopover
				trigger='click'
				placement='bottomLeft'
				arrow={false}
				destroyTooltipOnHide
				content={<Options {...props_options} />}
				open={x.visible_options}
				onOpenChange={onChangeCountVisible}
			>
				<div className='w_100 h_100'>
					<div className='btn_options w_100 h_100 flex justify_center align_center clickable'>
						<DotsThreeCircle size={15} />
					</div>
				</div>
			</AntdPopover>
		</Popover>
	)
}

export default new $app.handle(Index).by(observer).by($app.memo).get()
