export default {
	common: {
		status: {
			label: 'Status',
			unchecked: 'Unchecked',
			checked: 'Checked',
			closed: 'Closed'
		},
		level: 'Level',
		text: 'Text',
		children: 'Children',
		options: 'Options',
		archived: 'Archived'
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
		kanban_mode: {
			angle: 'Angle',
			tag: 'Tag'
		},
		visible_mode: {
			zen: 'Zen',
			normal: 'Normal'
		},
		table_mode: {
			filter: 'Filter'
		},
		mode: {
			list: 'List',
			kanban: 'Kanban',
			table: 'Table'
		},
		options: {
			edit: 'Edit',
			archive: 'Archive',
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
				'This will remove {{counts}} items under this category({{counts}} items). Please confirm if you want to proceed with the deletion.'
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
				two_hour: 'after two hours',
				half_day: 'after half day',
				day: 'tomorrow',
				after_tomorrow: 'day after tomorrow',
				three_day: 'after three days',
				week: 'after a week',
				half_month: 'after half month',
				month: 'after a month',
				half_year: 'after six months',
				year: 'after a year'
			}
		},
		Deadline: {
			title: 'Deadline'
		},
		Cycle: {
			type: {
				interval: 'cycle',
				specific: 'regular'
			},
			title: 'Repeat',
			cycle: 'Cycle',
			disabled: 'Disabled',
			every: 'every',
			exclude: 'exclude',
			options: {
				minute: 'minite',
				hour: 'hour',
				day: 'day',
				week: 'week',
				month: 'month',
				quarter: 'quarter',
				year: 'year',
				special: 'special',
				reset: 'reset'
			},
			specific: {
				clock: `{{value}} o'clock of each day`,
				weekday: '{{value}}',
				date: '{{value}}th of each month',
				special: '{{month}}-{{date}} each year',
				options: {
					clock: 'x of each day',
					weekday: 'x of each week',
					date: 'x of each month',
					special: 'x-x each year'
				}
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
			}
		},
		confirm: 'Do you want to delete all archives before {{date}}? Please confirm.',
		filter: {
			select: 'Select\t',
			angle: 'angle',
			tags: 'tags',
			date: '\tDate',
			begin: 'Begin',
			end: 'End',
			status: 'Status'
		}
	},
	Detail: {
		title: 'Detail',
		remark: {
			title: 'Remark',
			placeholder: 'Add Remark'
		},
		add_to_shcedule: 'Add To Schedule'
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
