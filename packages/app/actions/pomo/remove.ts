import type { DirTree } from '@/types'

const Index = async (focusing_item: DirTree.TransformedItem) => {
	await $db.pomo_items.find({ selector: { file_id: focusing_item.id } }).remove()
}

export default Index
