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
			placeholder: 'Please input description'
		},
		angles: {
			label: 'Angles',
			placeholder: 'Please input angles',
			remove_confirm: {
				title: 'Notice',
				content: 'You are performing a categorical deletion operation. This will remove all the tasks under this category. Please confirm if you want to proceed with the deletion.'
			}
		},
		tags: {
			label: 'Tags',
			placeholder: 'Tag name'
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
	}
}
