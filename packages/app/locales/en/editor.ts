export default {
	placeholder: `Write something, '/' for commands`,
	insert: 'Insert',
	name: {
		Image: 'Image',
		Emoji: 'Emoji',
		Code: 'Code',
		UnorderedList: 'Bullet List',
		OrderedList: 'Order List',
		TodoList: 'Todo List',
		Table: 'Table',
		Katex: 'Katex',
		Divider: 'Divider',
		Quote: 'Quote',
		Toggle: 'Toggle',
		Navigation: 'Catalog'
	},
	Image: {
		modal: {
			label: {
				url: 'URL',
				file: 'File',
				alt: 'Alt',
				inline: 'Inline'
			},
			placeholder: {
				url: 'Image URL',
				alt: 'Image alt text'
			}
		}
	},
	Katex: {
		modal: {
			label: {
				equation: 'Equation',
				inline: 'Inline'
			},
			placeholder: {
				equation: 'Equation expression'
			},
			preview: 'Preview'
		}
	},
	Navigation: {
		empty: 'No Headings detected'
	}
}
