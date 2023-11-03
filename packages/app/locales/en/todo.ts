export default {
	common: {
		status: {
			unchecked: 'Unchecked',
			checked: 'Checked',
			closed: 'Closed'
		},
		star: 'Star'
	},
	context_menu: {
		detail: 'Detail',
		insert: 'Insert',
		add_tags: 'Add Tags',
		insert_children: 'Add Child',
		move: 'Move To',
		remove: 'Remove',
		move_into: 'Into Child',
		move_out: 'Out'
	},
	default_angles: ['Now', 'Plan', 'Idea', 'Wait', 'Circle', 'Trashbox'],
	Header: {
		related: {
			reference: 'Reference',
			todograph: 'Todograph'
		},
		archive: 'Archive',
		options: {
			edit: 'Edit',
			sort: {
				text: 'Sort',
				importance: 'Importance',
				alphabetical: 'Alphabetical',
				create_at: 'Create Time'
			},
			tags: 'Tags',
			help: 'Help'
		}
	},
	SettingsModal: {
		desc: {
			label: 'Description',
			placeholder: 'A brief description about the todo.'
		},
		angles: {
			label: 'Angles',
			placeholder: 'Categories within the todo list.',
			remove_confirm:
				'This will remove {{counts}} items under this category. Please confirm if you want to proceed with the deletion.'
		},
		tags: {
			label: 'Tags',
			placeholder: 'Tag name.',
			remove_confirm:
				'This tag has {{counts}} items and cannot be deleted (tags not associated with any items can be deleted).'
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
			title: 'Repeat',
			day: 'days',
			hour: 'hours',
			minute: 'minutes',
			disabled: 'Disabled',
			unset: 'Unset'
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
		},
		confirm: 'Do you want to delete all archives before {{date}}? Please confirm.',
		filter: {
			select: 'select\t',
			angle: 'Angle',
			tags: 'Tags',
			date: '\tDate',
			begin: 'Begin',
			end: 'End',
			status: 'Status'
		}
	},
	Detail: {
		title: 'Detail'
	},
	Help: [
		{
			title: 'Quick Insert',
			desc: 'When the cursor is focused on task or subtask text, press Enter to insert the next task.'
		},
		{
			title: 'Move as Subtask',
			desc: 'When the cursor is focused on task text, press Tab to append the current task as a subtask to the previous task. Please note that Tab operation is disabled if the current task is a mutually exclusive task or if the list is in a filtered state.'
		},
		{
			title: 'Move as Top-Level Task',
			desc: 'When the cursor is focused on subtask text, press Tab to change the current subtask to the next top-level task. Please note that Tab operation is disabled if the list is in a filtered state.'
		},
		{
			title: 'Mutually Exclusive Tasks',
			desc: 'Drag the small dot in front of a task onto the small dot of the target task to mark tasks as mutually exclusive. You can mark multiple tasks as mutually exclusive simultaneously. To cancel the mutual exclusion, drag the small dot back to the already mutually exclusive tasks.'
		},
		{
			title: 'Expand Subtasks',
			desc: 'Click the small dot to expand subtasks.'
		}
	]
}
