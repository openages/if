export namespace KV {
	export type Item = {
		/** @maxLength 120 */
		key: string
		value: string
		update_at?: number
	}
}
