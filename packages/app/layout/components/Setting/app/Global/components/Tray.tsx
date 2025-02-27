import { Col, ConfigProvider, Row, Select, Switch } from 'antd'
import { motion, AnimatePresence } from 'framer-motion'
import { observer } from 'mobx-react-lite'
import { useState, Fragment } from 'react'
import { useTranslation } from 'react-i18next'
import { container } from 'tsyringe'

import { ModuleIcon } from '@/components'
import { useCreateEffect, useCreateLayoutEffect } from '@/hooks'

import TrayModel from './TrayModel'

const Index = () => {
	const [x] = useState(() => container.resolve(TrayModel))
	const { t } = useTranslation()
	const todo_files = $copy(x.todo_files)
	const todo_angles = $copy(x.todo_angles)
	const schedule_files = $copy(x.schedule_files)

	useCreateLayoutEffect(() => {
		x.init()

		return () => x.off()
	}, [])

	useCreateEffect(() => {
		if (x.todo_angle_id) return
		if (!todo_angles.length) return

		x.onSelectTodoAngle(todo_angles[0].id)
	}, [x.todo_file_id, x.todo_angle_id, todo_angles])

	if (!Object.keys(x.settings).length) return null

	return (
		<Fragment>
			<span className='setting_title'>{t('setting.Tray.title')}</span>
			<div className='setting_items w_100 border_box flex flex_column'>
				<div className='setting_item has_extra w_100 border_box flex flex_column'>
					<div
						className='setting_main w_100 flex justify_between align_center'
						onClick={x.toggleVisibleTodoFields}
					>
						<div className='title_wrap flex align_center'>
							<ModuleIcon type='todo' size={24}></ModuleIcon>
							<div className='text_wrap flex flex_column'>
								<span className='title'>{t('setting.Tray.Todo.title')}</span>
								<span className='desc'>{t('setting.Tray.Todo.desc')}</span>
							</div>
						</div>
						<div className='value_wrap flex align_center'>
							<If condition={!x.visible_todo_fields}>
								<div className='options_line'></div>
							</If>
							<Switch value={x.todo_active} onChange={x.changeTodoActive}></Switch>
						</div>
					</div>
					<AnimatePresence>
						{x.visible_todo_fields && (
							<motion.div
								className='extra_wrap w_100 border_box'
								initial={{ opacity: 0, height: 0 }}
								animate={{ opacity: 1, height: 'auto' }}
								exit={{ opacity: 0, height: 0 }}
								transition={{ duration: 0.18 }}
							>
								<ConfigProvider theme={{ token: { controlHeight: 32 } }}>
									<div className='extra w_100 border_box'>
										<Row gutter={12}>
											<Col span={12}>
												<Select
													className='select w_100'
													placeholder={t(
														'setting.Tray.select_file'
													)}
													fieldNames={{
														label: 'name',
														value: 'id'
													}}
													optionFilterProp='name'
													showSearch
													options={todo_files}
													value={x.todo_file_id}
													onSelect={x.onSelectTodoFile}
												></Select>
											</Col>
											<Col span={12}>
												<Select
													className='select w_100'
													placeholder={t(
														'setting.Tray.Todo.select_angle'
													)}
													fieldNames={{
														label: 'text',
														value: 'id'
													}}
													optionFilterProp='text'
													showSearch
													options={todo_angles}
													value={x.todo_angle_id}
													onSelect={x.onSelectTodoAngle}
												></Select>
											</Col>
										</Row>
									</div>
								</ConfigProvider>
							</motion.div>
						)}
					</AnimatePresence>
				</div>
				<div className='setting_item w_100 border_box flex flex_column'>
					<div
						className='setting_main w_100 flex justify_between align_center'
						onClick={x.toggleVisibleScheduleFields}
					>
						<div className='title_wrap flex align_center'>
							<ModuleIcon type='schedule' size={24}></ModuleIcon>
							<div className='text_wrap flex flex_column'>
								<span className='title'>{t('setting.Tray.Schedule.title')}</span>
								<span className='desc'>{t('setting.Tray.Schedule.desc')}</span>
							</div>
						</div>
						<div className='value_wrap flex align_center'>
							<If condition={!x.visible_schedule_fields}>
								<div className='options_line'></div>
							</If>
							<Switch value={x.schedule_active} onChange={x.changeScheduleActive}></Switch>
						</div>
					</div>
					<AnimatePresence>
						{x.visible_schedule_fields && (
							<motion.div
								className='extra_wrap w_100 border_box'
								initial={{ opacity: 0, height: 0 }}
								animate={{ opacity: 1, height: 'auto' }}
								exit={{ opacity: 0, height: 0 }}
								transition={{ duration: 0.18 }}
							>
								<ConfigProvider theme={{ token: { controlHeight: 32 } }}>
									<div className='extra w_100 border_box'>
										<Select
											className='select w_100'
											placeholder={t('setting.Tray.select_file')}
											fieldNames={{
												label: 'name',
												value: 'id'
											}}
											optionFilterProp='name'
											showSearch
											options={schedule_files}
											value={x.schedule_file_id}
											onSelect={x.onSelectScheduleFile}
										></Select>
									</div>
								</ConfigProvider>
							</motion.div>
						)}
					</AnimatePresence>
				</div>
			</div>
		</Fragment>
	)
}

export default new $app.handle(Index).by(observer).by($app.memo).get()
