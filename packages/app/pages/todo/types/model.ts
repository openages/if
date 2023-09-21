import type { Dayjs } from "dayjs"
import type { RxDB } from "@/types"

export type ItemsSortParams = {
      create_at: RxDB.SortType
      star:RxDB.SortType
}

export type ArchiveQueryParams = {
	angle_id?: string
	tags?: Array<string>
	begin_date?: Dayjs
	end_date?: Dayjs
	status?: 'unchecked' | 'closed'
}
