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
		Katex: 'Katex',
		Divider: 'Divider'
	},
	Image: {
		modal: {
			label: {
				url: '链接',
				file: '文件',
				alt: '说明'
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
	}
}
