import type { Tag } from '../common'

export namespace Schedule {
	export interface Setting {
		tags: Array<Tag>
	}

	export interface ScheduleSetting {
		file_id: string
		module: string
		setting: Setting
	}

	export interface Item {
		/** @maxLength 30 */
		id: string
		/** @maxLength 30 */
		file_id: string
		type: 'calendar' | 'timeline' | 'fixed'
		/** @maxLength 30 */
		tag: string
		text: string
		todos: Array<string>
		/**
		 * @multipleOf 1
		 * @minimum 1
		 * @maximum 9007199254740991
		 * */
		start_time: number
		/**
		 * @multipleOf 1
		 * @minimum 1
		 * @maximum 9007199254740991
		 * */
		end_time: number
	}

	export type CalendarItem = Item & { start: number; length: number; past: boolean }
	export type CalendarDay = Array<CalendarItem>
	export type CalendarDays = Array<CalendarDay>
}
