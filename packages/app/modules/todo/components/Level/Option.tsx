import { Check } from '@phosphor-icons/react'

import FlatLevel from '../FlatLevel'

import type { DefaultOptionType } from 'antd/es/select'

const Index = (props: DefaultOptionType & { selected?: boolean; as_label?: boolean }) => {
	const { label, value, selected, as_label } = props

	return (
		<div className='option_item w_100 flex justify_between align_center'>
			<div className='flex align_center'>
				<FlatLevel as_label value={value as number}></FlatLevel>
				<span className='label'>{label}</span>
			</div>
			{!as_label && (
				<div className='ml_12 flex align_center'>
					{selected && <Check className='mr_8' size={14} weight='bold'></Check>}
					<span className='value'>{value}</span>
				</div>
			)}
		</div>
	)
}

export default $app.memo(Index)
