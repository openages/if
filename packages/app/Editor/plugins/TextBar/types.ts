import type Model from './model'

export type Format = 'bold' | 'italic' | 'strikethrough' | 'underline' | 'code' | 'link' | 'heading' | 'list'

export type Formats = Record<Format, boolean>

export type ListType = 'bullet' | 'number' | 'check'

export interface IPropsFormats {
	md: boolean
	formats: Model['formats']
	heading_type: Model['heading_type']
	list_type: Model['list_type']
	setRef: (v: HTMLElement) => void
	onFormat: Model['onFormat']
}
