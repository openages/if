import { Select } from 'antd'
import { motion, AnimatePresence } from 'framer-motion'
import { observer } from 'mobx-react-lite'
import { useLayoutEffect, useState } from 'react'
import { createPortal } from 'react-dom'
import { SiPrettier } from 'react-icons/si'
import { bundledLanguagesInfo } from 'shiki'
import { container } from 'tsyringe'

import { useStackSelector } from '@/context/stack'
import { useLexicalComposerContext } from '@lexical/react/LexicalComposerContext'
import { ArrowsInSimple, ArrowsOutSimple, Check, Copy } from '@phosphor-icons/react'

import styles from './index.css'
import Model from './model'

const options = bundledLanguagesInfo.map(item => ({ label: item.name, value: item.id }))

const Index = () => {
	const [x] = useState(() => container.resolve(Model))
	const [editor] = useLexicalComposerContext()
	const id = useStackSelector(v => v.id)
	const [exist, setExsit] = useState(false)
	const [copyied, setCopied] = useState(false)

	useLayoutEffect(() => {
		x.init(id, editor)
	}, [id, editor])

	useLayoutEffect(() => {
		if (x.visible) return setExsit(true)

		const timer = setTimeout(() => {
			setExsit(false)
		}, 180)

		return () => clearTimeout(timer)
	}, [x.visible])

	useLayoutEffect(() => {
		if (!copyied) return

		const timer = setTimeout(() => {
			setCopied(false)
		}, 1200)

		return () => clearTimeout(timer)
	}, [copyied])

	if (!exist) return null

	const Content = (
		<AnimatePresence>
			{x.visible && (
				<motion.div
					className={$cx('fixed z_index_100 border_box flex align_center', styles._local)}
					style={{ left: x.position.left, top: x.position.top }}
					initial={{ opacity: 0 }}
					animate={{ opacity: 1 }}
					exit={{ opacity: 0 }}
					transition={{ duration: 0.18 }}
				>
					<Select
						className='lang_select mr_4'
						popupClassName={styles.lang_dropdown}
						popupMatchSelectWidth={false}
						size='small'
						showSearch
						suffixIcon={null}
						options={options}
						value={x.lang}
						onChange={x.onChangeLang}
					></Select>
					<div className='btn_actions_wrap border_box flex'>
						<div
							className={$cx(
								'btn_action flex justify_center align_center clickable',
								!x.formatable && 'disabled'
							)}
							onClick={x.onFormat}
						>
							<SiPrettier size={10}></SiPrettier>
						</div>
						<div
							className='btn_action flex justify_center align_center clickable'
							onClick={() => x.onFold()}
						>
							{x.fold ? <ArrowsOutSimple /> : <ArrowsInSimple />}
						</div>
						<div
							className='btn_action flex justify_center align_center clickable'
							onClick={() => {
								setCopied(true)

								x.onCopy()
							}}
						>
							{copyied ? <Check /> : <Copy />}
						</div>
					</div>
				</motion.div>
			)}
		</AnimatePresence>
	)

	return createPortal(Content, document.getElementById(id))
}

export default new $app.handle(Index).by(observer).by($app.memo).get()
