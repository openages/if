export interface IPropsCustomFormItem<T> {
	value?: T
	onChange?: (v: T) => void
}

export type Mutable<T> = {
	-readonly [K in keyof T]: T[K] extends ReadonlyArray<infer U>
		? Array<Mutable<U>>
		: T[K] extends object
		  ? Mutable<T[K]>
		  : T[K]
}

export type CustomFormItem<T> = {
	value?: T
	onChange?: (...args: any) => any
}

export interface Tag {
	id: string
	color: string
	text: string
}

export type CleanTime = '1year' | '6month' | '3month' | '1month' | '15days' | '1week'
