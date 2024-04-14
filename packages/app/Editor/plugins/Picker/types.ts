import type Option from './option'

export interface IPropsMenu {
	options: Array<Option>
	selected_index: number
	selectOptionAndCleanUp: (option: Option) => void
	setHighlightedIndex: (index: number) => void
}

export interface IPropsItem {
	option: Option
	index: number
	selected: boolean
	selectOptionAndCleanUp: IPropsMenu['selectOptionAndCleanUp']
	setHighlightedIndex: IPropsMenu['setHighlightedIndex']
}
