import type { Dayjs } from 'dayjs'

export type ItemsSortParams = {
	type: 'importance' | 'alphabetical' | 'create_at'
	order: 'asc' | 'desc'
}

export type ArchiveQueryParams = {
	angle_id?: string
	tags?: Array<string>
	begin_date?: Dayjs
	end_date?: Dayjs
	status?: 'unchecked' | 'closed'
}
