import { id } from '@/utils'

export default async (file_id: string) => {
	return $db.note_items.insert({
		file_id,
		id: id(),
		content: '',
		sort: 1
	})
}
