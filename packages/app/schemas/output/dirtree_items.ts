export default ({
	'DirTreeItems.Item': {
		type: 'object',
		properties: {
			module: {
				type: 'string',
				maxLength: 30
			},
			type: {
				type: 'string',
				enum: ['dir', 'file']
			},
			id: {
				type: 'string',
				maxLength: 30
			},
			name: {
				type: 'string'
			},
			pid: {
				type: 'string'
			},
			prev_id: {
				type: 'string'
			},
			next_id: {
				type: 'string'
			},
			icon: {
				type: 'string'
			},
			icon_hue: {
				type: 'number'
			}
		},
		required: ['module', 'type', 'id', 'name']
	},
	'DirTree.Item': {
		type: 'object',
		properties: {
			module: {
				type: 'string',
				maxLength: 30
			},
			type: {
				type: 'string',
				enum: ['dir', 'file']
			},
			id: {
				type: 'string',
				maxLength: 30
			},
			name: {
				type: 'string'
			},
			pid: {
				type: 'string'
			},
			prev_id: {
				type: 'string'
			},
			next_id: {
				type: 'string'
			},
			icon: {
				type: 'string'
			},
			icon_hue: {
				type: 'number'
			}
		},
		required: ['module', 'type', 'id', 'name']
	}
} as const)
