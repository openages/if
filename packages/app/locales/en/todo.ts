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
			placeholder: 'Tag name',
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
		Remind: {
			title: 'Remind',
			options: {
				two_hour: 'Two hours later',
				half_day: 'Half day later',
				day: 'Tomorrow',
				after_tomorrow: 'Day after tomorrow',
				three_day: 'Three days later',
				week: 'A week later',
				half_month: 'Half month later',
				month: 'A month later',
				half_year: 'Six months later',
				year: 'A year later'
			}
		},
		Cycle: {
			title: 'Repeat',
			cycle: 'Cycle',
			disabled: 'Disabled',
			every: 'Every',
			exclude: 'exclude',
			options: {
				minute: 'Minite',
				hour: 'Hour',
				day: 'Day',
				week: 'Week',
				month: 'Month',
				quarter: 'Quarter',
				year: 'Year',
				reset: 'Reset'
			}
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
		title: 'Detail',
		remark: {
			placeholder: 'Add Remark'
		}
	},
	Help: [
		{
			title: 'Quick Insertion',
			desc: 'With the cursor focused, press Enter to insert the next task.'
		},
		{
			title: 'Move to Subtask',
			desc: 'Focus the cursor and press Tab to append the current task as a subtask to the previous one.'
		},
		{
			title: 'Move to Top-level Task',
			desc: 'While focusing on the subtask text, press Tab to change the current subtask to the next top-level task.'
		},
		{
			title: 'Add Mutex Task',
			desc: 'Drag the small dot in front of a task to the dot of the target task to mark tasks as mutually exclusive. Supports marking multiple tasks as exclusive simultaneously.'
		},
		{
			title: 'Cancel Mutex Task',
			desc: 'Drag the dot again to the already mutually exclusive task to cancel the mutex connection.'
		},
		{
			title: 'Expand Subtasks',
			desc: 'Click the small dot to expand subtasks.'
		}
	]
}
