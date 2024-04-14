import { MenuOption } from '@lexical/react/LexicalTypeaheadMenuPlugin'

export default class Index extends MenuOption {
	title: string
	icon: JSX.Element
	keywords: Array<string>
	keyboardShortcut?: string
	onSelect: (query_string: string) => void

	constructor(
		title: string,
		options: {
			icon?: Index['icon']
			keywords?: Index['keywords']
			keyboardShortcut?: Index['keyboardShortcut']
			onSelect: Index['onSelect']
		}
	) {
		super(title)

		const { icon, keywords, keyboardShortcut, onSelect } = options

		this.title = title
		this.icon = icon
		this.keyboardShortcut = keyboardShortcut
		this.keywords = keywords || []
		this.onSelect = onSelect.bind(this)
	}
}
