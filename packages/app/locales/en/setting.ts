export default {
	nav: {
		titles: {
			Global: 'Global',
			Menu: 'Menu',
			Tasks: 'Tasks',
			Shortcuts: 'Shortcuts'
		}
	},
	Normal: {
		title: 'Setting',
		language: {
			title: 'Language',
			desc: 'Languages used by application'
		},
		theme: {
			title: 'Theme',
			desc: 'App theme color, component color',
			options: {
				light: 'Light',
				dark: 'Dark'
			},
			auto_theme: 'Auto theme, light theme from 6AM to 6PM, dark theme the rest of time'
		},
		show_bar_title: {
			title: 'Bar Title',
			desc: 'Display title below navigation icon',
			options: {
				hide: 'Hide',
				show: 'Show'
			}
		},
		page_width: {
			title: 'Page Width',
			desc: 'Width rules of content page',
			options: {
				unlimited: 'Full',
				limited: 'Limited'
			}
		}
	},
	NavItems: {
		title: 'Feature'
	},
	ColorSelector: {
		title: 'Theme Color'
	},
	Screenlock: {
		title: 'Screen Lock',
		password: {
			title: 'Password',
			desc: 'Set app screen lock password'
		},
		autolock: {
			title: 'Autolock',
			desc: 'Lock the screen when inactive'
		},
		getFingerprint: {
			error: 'Fingerprint generation failed, please contact the developer.'
		}
	},
	Note: {
		serif: {
			title: 'Serif',
			desc: 'Readability, professionalism, and recognizability'
		},
		small_text: {
			title: 'Small Text',
			desc: 'Optimal size for more content'
		},
		toc: {
			title: 'Table of Contents',
			desc: 'Overview of article structure',
			options: ['default', 'visible', 'minimize', 'hidden']
		},
		count: {
			title: 'Word Count',
			desc: 'Count the total number of words, excluding spaces'
		},
		batch_import: {
			desc: 'Batch import markdown files'
		}
	}
}
