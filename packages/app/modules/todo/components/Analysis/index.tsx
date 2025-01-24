import { Drawer } from 'antd'
import { useTranslation } from 'react-i18next'

import { Chart, Duration, Export, List, ListHeader } from './components'
import styles from './index.css'

import type {
	IPropsAnalysis,
	IPropsAnalysisDuration,
	IPropsAnalysisChart,
	IPropsAnalysisListHeader,
	IPropsAnalysisList,
	IPropsAnalysisExport
} from '../../types'

const Index = (props: IPropsAnalysis) => {
	const {
		visible_analysis_modal,
		angles,
		tags,
		trending,
		items,
		analysis_duration,
		analysis_sort_params,
		analysis_filter_angles,
		analysis_filter_tags,
		analysis_custom_prefix,
		setDuration,
		setSortParams,
		setFilterAngles,
		setFilterTags,
		setCustomPrefix,
		onClose
	} = props
	const { t } = useTranslation()

	console.log(trending, items)

	const props_duration: IPropsAnalysisDuration = {
		analysis_duration,
		setDuration
	}

	const props_chart: IPropsAnalysisChart = {
		trending
	}

	const props_list_header: IPropsAnalysisListHeader = {
		angles,
		tags,
		analysis_sort_params,
		analysis_filter_angles,
		analysis_filter_tags,
		setSortParams,
		setFilterAngles,
		setFilterTags
	}

	const props_list: IPropsAnalysisList = {
		data: ''
	}

	const props_export: IPropsAnalysisExport = {
		data: '',
		analysis_custom_prefix,
		setCustomPrefix
	}

	return (
		<Drawer
			rootClassName={styles._local}
			open={visible_analysis_modal}
			title={t('todo.Analysis.title')}
			width='min(600px,calc(100% - 24px))'
			destroyOnClose
			getContainer={false}
			footer={null}
			onClose={onClose}
		>
			<Duration {...props_duration}></Duration>
			<Chart {...props_chart}></Chart>
			<ListHeader {...props_list_header}></ListHeader>
			<List {...props_list}></List>
			<Export {...props_export}></Export>
		</Drawer>
	)
}

export default $app.memo(Index)
