import { useMemoizedFn } from 'ahooks'
import { Select, Switch } from 'antd'
import { observer } from 'mobx-react-lite'
import { useLayoutEffect, useMemo, useState } from 'react'
import { useTranslation } from 'react-i18next'

import { updateSetting } from '@/actions/note'
import { NoteSettings } from '@/models'
import { ArticleNyTimes, ListDashes, TextT, Toolbox } from '@phosphor-icons/react'

import styles from './index.css'

const Index = () => {
	const [x] = useState(() => new NoteSettings())
	const { t } = useTranslation()

	useLayoutEffect(() => {
		x.init()

		return () => x.off()
	}, [])

	const toc_options = useMemo(() => {
		const options = t('translation:setting.Note.toc.options') as Array<string>

		return options.map(item => ({ label: item, value: item }))
	}, [t])

	const onChangeSerif = useMemoizedFn((v: boolean) => {
		x.settings.serif = v

		updateSetting({ serif: v })
	})

	const onChangeSmallText = useMemoizedFn((v: boolean) => {
		x.settings.small_text = v

		updateSetting({ small_text: v })
	})

	const onChangeToc = useMemoizedFn(v => {
		x.settings.toc = v

		updateSetting({ toc: v })
	})

	const onChangeCount = useMemoizedFn((v: boolean) => {
		x.settings.count = v

		updateSetting({ count: v })
	})

	return (
		<div className={$cx('flex flex_column', styles._local)}>
			<span className='setting_title'>{t('translation:modules.note')}</span>
			<div className='setting_items w_100 border_box flex flex_column'>
				<div className='setting_item w_100 border_box flex justify_between align_center'>
					<div className='title_wrap flex align_center'>
						<ListDashes size={24}></ListDashes>
						<div className='text_wrap flex flex_column'>
							<span className='title'>{t('translation:setting.Note.toc.title')}</span>
							<span className='desc'>{t('translation:setting.Note.toc.desc')}</span>
						</div>
					</div>
					<div className='value_wrap flex align_center'>
						<Select
							className='select'
							value={x.settings.toc}
							options={toc_options}
							onSelect={onChangeToc}
						></Select>
					</div>
				</div>
				<div className='setting_item w_100 border_box flex justify_between align_center'>
					<div className='title_wrap flex align_center'>
						<TextT size={24}></TextT>
						<div className='text_wrap flex flex_column'>
							<span className='title'>{t('translation:setting.Note.serif.title')}</span>
							<span className='desc'>{t('translation:setting.Note.serif.desc')}</span>
						</div>
					</div>
					<div className='value_wrap flex align_center'>
						<Switch value={x.settings.serif} onChange={onChangeSerif}></Switch>
					</div>
				</div>
				<div className='setting_item w_100 border_box flex justify_between align_center'>
					<div className='title_wrap flex align_center'>
						<ArticleNyTimes size={24}></ArticleNyTimes>
						<div className='text_wrap flex flex_column'>
							<span className='title'>
								{t('translation:setting.Note.small_text.title')}
							</span>
							<span className='desc'>{t('translation:setting.Note.small_text.desc')}</span>
						</div>
					</div>
					<div className='value_wrap flex align_center'>
						<Switch value={x.settings.small_text} onChange={onChangeSmallText}></Switch>
					</div>
				</div>
				<div className='setting_item w_100 border_box flex justify_between align_center'>
					<div className='title_wrap flex align_center'>
						<Toolbox size={24}></Toolbox>
						<div className='text_wrap flex flex_column'>
							<span className='title'>{t('translation:setting.Note.count.title')}</span>
							<span className='desc'>{t('translation:setting.Note.count.desc')}</span>
						</div>
					</div>
					<div className='value_wrap flex align_center'>
						<Switch value={x.settings.count} onChange={onChangeCount}></Switch>
					</div>
				</div>
			</div>
		</div>
	)
}

export default new $app.handle(Index).by(observer).by($app.memo).get()
