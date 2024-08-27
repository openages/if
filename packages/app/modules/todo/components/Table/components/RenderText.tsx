import { useMemoizedFn } from 'ahooks'

import { todo } from '@/appdata'
import { useText, useTextChange, Text } from '@/Editor'

import styles from '../index.css'

import type { Todo } from '@/types'
import type { IPropsFormTableComponent } from '@/components'

const Index = (props: IPropsFormTableComponent<Todo.Todo['text']>) => {
	const { value, editing, onFocus, onBlur, onChange: onChangeItem } = props

	const { ref_editor, onChange, setEditor } = useText({
		text: value!,
		update: v => onChangeItem!(v)
	})

	useTextChange({ ref_editor, text: value! })

	const onEditorFocus = useMemoizedFn((v: boolean) => {
		if (v) {
			onFocus!()
		} else {
			onBlur!()
		}
	})

	return (
		<Text
			className={$cx('w_100', styles.RenderText)}
			max_length={todo.text_max_length}
			readonly={!editing}
			disable_textbar
			onChange={onChange}
			setEditor={setEditor}
			onFocus={onEditorFocus}
		></Text>
	)
}

export default $app.memo(Index)
