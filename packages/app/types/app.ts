export namespace App {
	export type ModuleType =
		| 'todo'
		| 'memo'
		| 'note'
		| 'pomodoro'
		| 'widgets'
		| 'kanban'
		| 'flow'
		| 'board'
		| 'project'
		| 'table'
		| 'bi'
		| 'ppt'
		| 'schedule'
		| 'habbit'

	/** @maxLength 12 */
	export type RealModuleType = Exclude<ModuleType, 'widgets'>
}
