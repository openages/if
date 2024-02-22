import { useMemoizedFn } from 'ahooks'

import { useInput } from '@/modules/todo/hooks'

import styles from './index.css'

interface IProps {
	value?: string
	max_length?: number
	placeholder?: string
	className?: string
	onChange?: (v: string) => void
}

const Index = (props: IProps) => {
	const { value, max_length, placeholder, className, onChange } = props

	const { input, onInput } = useInput({
		value,
		max_length,
		update: useMemoizedFn(textContent => onChange(textContent))
	})

	const onKeyDown = useMemoizedFn(e => {
		if (e.key === 'Enter' || e.key === 'Tab') {
			e.preventDefault()
		}
	})

	return (
		<div
			className={$cx(styles._local, className)}
			ref={input}
			contentEditable='plaintext-only'
			data-placeholder={placeholder}
			onInput={onInput}
			onKeyDown={onKeyDown}
		></div>
	)
}

export default $app.memo(Index)
