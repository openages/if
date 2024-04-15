export namespace Note {
	export type Item = {
		/** @maxLength 30 */
		id: string
		/** @maxLength 30 */
		file_id: string
		content: string
	}
}
