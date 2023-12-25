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
