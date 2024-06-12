import type { EditorThemeClasses } from 'lexical'

export default {
	root: '__editor_root',
	heading: {
		h1: '__editor_heading __editor_heading_h1',
		h2: '__editor_heading __editor_heading_h2',
		h3: '__editor_heading __editor_heading_h3',
		h4: '__editor_heading __editor_heading_h4',
		h5: '__editor_heading __editor_heading_h5',
		h6: '__editor_heading __editor_heading_h6'
	},
	text: {
		bold: '__editor_text_bold',
		code: '__editor_text_code',
		italic: '__editor_text_italic',
		strikethrough: '__editor_text_strikethrough',
		underline: '__editor_text_underline'
	},
	list: {
		ul: '__editor_list_ul __editor_block',
		ol: '__editor_list_ol __editor_block',
		listitem: '__editor_list_item',
		checklist: '__editor_list_checklist __editor_block',
		listitemChecked: '__editor_list_item_checked',
		listitemUnchecked: '__editor_list_item_unchecked',
		nested: { listitem: '__editor_list_item_nested' }
	},
	link: '__editor_link',
	code: '__editor_code'
} as EditorThemeClasses
