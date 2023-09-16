export default {
	default_angles: ['Now', 'Plan', 'Idea', 'Wait', 'Circle', 'Trashbox'],
	Header: {
		edit: 'Edit',
		reference: 'Reference',
		archive: 'Archive'
	},
	SettingsModal: {
		desc: {
			label: 'Description',
			placeholder: 'A brief description about the todo.'
		},
		angles: {
			label: 'Angles',
			placeholder: 'Categories within the todo list.',
			remove_confirm: {
				title: 'Notice',
				content: 'You are performing a categorical deletion operation. This will remove all the tasks under this category. Please confirm if you want to proceed with the deletion.'
			}
		},
		tags: {
			label: 'Tags',
			placeholder: 'Tag name.'
		},
		auto_archiving: {
			label: 'Auto archiving',
			options: {
				'0m': 'right now',
				'3m': '3 minutes',
				'3h': '3 hours',
				'1d': '1 day',
				'3d': '3 day',
				'7d': '1 week'
			}
		}
	},
	Input: {
		placeholder: 'Add Todo',
		tag_placeholder: 'Tags',
		type: {
			todo: 'Todo',
			group: 'Group'
		},
		Circle: {
			title: 'Task loop cycle',
			day: 'Days',
			hour: 'Hours',
			minute: 'Minutes'
		}
	},
	Archive: {
		title: 'Archive',
		end: 'Reached the end',
		restore: 'Restore',
		remove: 'Remove',
		clean: {
			title: 'Clean:',
			placeholder: 'Select date',
			options: {
				'1year': '1 year ago',
				'6month': '6 months ago',
				'3month': '3 months ago',
				'1month': '1 month ago',
				'15days': '15 days ago',
				'1week': '1 week ago'
			},
			total: 'Total of {{counts}} items'
		}
	}
}
