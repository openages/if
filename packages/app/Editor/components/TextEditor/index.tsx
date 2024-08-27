import { useText, useTextChange, Text } from '@/Editor'

import type { IPropsCustomFormItem } from '@/types'

interface IProps extends IPropsCustomFormItem<string> {
	className?: HTMLDivElement['className']
	placeholder_classname?: string
	placeholder?: string
	max_length?: number
}

const Index = (props: IProps) => {
	const { value, className, placeholder, placeholder_classname, max_length, onChange: onChangeValue } = props

	const { ref_editor, onChange, setEditor, setRef } = useText({ text: value!, update: v => onChangeValue(v) })

	useTextChange({ ref_editor, text: value! })

	return (
		<Text
			className={$cx('border_box', className)}
			placeholder_classname={placeholder_classname}
			placeholder={placeholder}
			max_length={max_length}
			onChange={onChange}
			setEditor={setEditor}
			setRef={setRef}
		></Text>
	)
}

export default $app.memo(Index)
