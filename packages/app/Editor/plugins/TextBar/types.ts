export type Formats = Record<
	'bold' | 'italic' | 'strikethrough' | 'underline' | 'code' | 'link' | 'heading' | 'list',
	boolean
>

export interface IPropsFormats {
	md: boolean
}
