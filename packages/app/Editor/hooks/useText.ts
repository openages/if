import { useMemoizedFn } from 'ahooks'
import { useRef } from 'react'

import type { LexicalEditor } from 'lexical'

interface Args {
	update: (v: string) => void
}

export default (args: Args) => {
	const { update } = args
	const ref_editor = useRef<LexicalEditor>(null)
	const ref_input = useRef<HTMLDivElement>(null)

	const onChange = useMemoizedFn(v => update(v))
	const setEditor = useMemoizedFn((v: LexicalEditor) => (ref_editor.current = v))
	const setRef = useMemoizedFn((v: HTMLDivElement) => (ref_input.current = v))

	return { ref_editor, ref_input, onChange, setEditor, setRef }
}
