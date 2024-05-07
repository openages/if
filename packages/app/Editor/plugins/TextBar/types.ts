import type Model from './model'

export type Format = 'bold' | 'italic' | 'strikethrough' | 'underline' | 'code' | 'link' | 'heading' | 'list'

export type Formats = Record<Format, boolean>

export interface IPropsFormats {
	md: boolean
	formats: Model['formats']
	setRef: (v: HTMLElement) => void
	onFormat: Model['onFormat']
}
