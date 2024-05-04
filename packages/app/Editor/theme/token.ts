import type { EditorThemeClasses } from 'lexical'

export default {
	list: {
		ul: '__editor_list_ul',
		ol: '__editor_list_ol',
		listitem: '__editor_list_item',
		checklist: '__editor_list_checklist',
		listitemChecked: '__editor_list_item_checked',
		listitemUnchecked: '__editor_list_item_unchecked',
		nested: { listitem: '__editor_list_item_nested' }
	}
} as EditorThemeClasses
