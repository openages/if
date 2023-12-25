export namespace ModuleSetting {
	export type Item = {
		/** @maxLength 30 */
		module: string
		/** @maxLength 30 */
		file_id: string
		setting: string
	}
}
