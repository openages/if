import { useMemoizedFn } from 'ahooks'
import { Button, DatePicker, Form, Input, Select } from 'antd'
import { motion, AnimatePresence } from 'framer-motion'
import { useTranslation } from 'react-i18next'

import { options_abled, options_status, options_yes_no } from '@/appdata'
import { useOptions } from '@/hooks'

import styles from './index.css'

import type { IPropsTableFilter } from '../../../../types'
const { useForm, Item } = Form

const Index = (props: IPropsTableFilter) => {
	const { visible_table_filter, angles, tags, onTableSearch } = props
	const [form] = useForm()
	const { t } = useTranslation()
	const status_options = useOptions(options_status, 'todo.common.status')
	const level_options = useOptions([1, 2, 3, 4])
	const abled_options = useOptions(options_abled, true)
	const yes_no_options = useOptions(options_yes_no, true)

	const onReset = useMemoizedFn(() => onTableSearch({}))

	return (
		<AnimatePresence>
			{visible_table_filter && (
				<motion.div
					className={$cx(styles._local)}
					initial={{ opacity: 0, height: 0 }}
					animate={{ opacity: 1, height: 'auto' }}
					exit={{ opacity: 0, height: 0 }}
					transition={{ duration: 0.18 }}
					layout
				>
					<Form
						form={form}
						className='form flex justify_between flex_wrap'
						size='small'
						onFinish={onTableSearch}
						onReset={onReset}
					>
						<div className='flex flex_wrap'>
							<Item name='text'>
								<Input
									className='input'
									allowClear
									placeholder={t('todo.common.text')}
									maxLength={15}
								></Input>
							</Item>
							<Item name='status'>
								<Select
									className='select'
									allowClear
									virtual={false}
									suffixIcon={null}
									placeholder={t('todo.common.status.label')}
									options={status_options}
								></Select>
							</Item>
							<Item name='angle_id'>
								<Select
									className='select'
									allowClear
									virtual={false}
									suffixIcon={null}
									placeholder={t('todo.Archive.filter.angle')}
									fieldNames={{ label: 'text', value: 'id' }}
									options={angles}
								></Select>
							</Item>
							<Item name='tag_id'>
								<Select
									className='select'
									allowClear
									virtual={false}
									suffixIcon={null}
									placeholder={t('todo.Archive.filter.tags')}
									fieldNames={{ label: 'text', value: 'id' }}
									options={tags}
								></Select>
							</Item>
							<Item name='level'>
								<Select
									className='select'
									allowClear
									virtual={false}
									suffixIcon={null}
									placeholder={t('todo.common.level')}
									options={level_options}
								></Select>
							</Item>
							<Item name='remind_time'>
								<DatePicker
									className='datepicker'
									allowClear
									suffixIcon={null}
									placeholder={t('todo.Input.Remind.title')}
								></DatePicker>
							</Item>
							<Item name='end_time'>
								<DatePicker
									className='datepicker'
									allowClear
									suffixIcon={null}
									placeholder={t('todo.Input.Deadline.title')}
								></DatePicker>
							</Item>
							<Item name='cycle_enabled'>
								<Select
									className='select'
									allowClear
									virtual={false}
									suffixIcon={null}
									placeholder={t('todo.Input.Cycle.title')}
									options={abled_options}
								></Select>
							</Item>
							<Item name='schedule'>
								<Select
									className='select'
									allowClear
									virtual={false}
									suffixIcon={null}
									placeholder={t('modules.schedule')}
									options={yes_no_options}
								></Select>
							</Item>
							<Item name='archive'>
								<Select
									className='select'
									allowClear
									virtual={false}
									suffixIcon={null}
									placeholder={t('todo.Archive.title')}
									options={yes_no_options}
								></Select>
							</Item>
							<Item name='create_at'>
								<DatePicker
									className='datepicker'
									allowClear
									suffixIcon={null}
									placeholder={t('todo.Header.options.sort.create_at')}
								></DatePicker>
							</Item>
						</div>
						<div className='flex'>
							<Button className='btn_action mr_12 mb_12' htmlType='reset'>
								{t('common.reset')}
							</Button>
							<Button className='btn_action btn_main mb_12' htmlType='submit'>
								{t('common.search')}
							</Button>
						</div>
					</Form>
				</motion.div>
			)}
		</AnimatePresence>
	)
}

export default $app.memo(Index)
