export const getPomo = (id: string) => {
	return $db.pomo_items.findOne({ selector: { file_id: id } })
}
