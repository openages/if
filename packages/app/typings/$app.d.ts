interface $App {
	memo: <T>(el: (props: T) => JSX.Element | null) => React.MemoExoticComponent<(props: T) => JSX.Element | null>
	handle: typeof Handle
	Event: Emittery
}
