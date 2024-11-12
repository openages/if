export default {
	nav: {
		titles: {
			Global: 'Global',
			Account: 'Account',
			Paid: 'Billing',
			Menu: 'Menu',
			Tasks: 'Tasks',
			Shortcuts: 'Shortcuts',
			Tutorial: 'Tutorial',
			About: 'About'
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
	Paid: {
		mac_app_store: {
			desc: 'Log in to the App Store version and subscribe. Log in to the account in the independent distribution version',
			btn_pay: 'Go to AppStore'
		},
		desc_wrap: {
			text: `The subscription will renew automatically and can be canceled at any time. If the user's plan does not update after a successful purchase, you can try`,
			restore_purchase: 'Restore Purchase',
			privacy: 'Privacy Policy',
			terms: 'Terms of Use'
		},
		file: 'File',
		unit: 'MO',
		unlimited: 'Unlimited',
		common: {
			'0': 'Dark Mode',
			'1': 'Screenlock',
			'2': 'Multi Theme Color',
			'3': 'Import & Export Markdown'
		},
		free: {
			type: 'Free',
			btn_text: 'Rate In Mac App Store'
		},
		pro: {
			type: 'Pro',
			value: '$3',
			btn_text: 'Become Professional'
		},
		sponsor: {
			type: 'Sponsor',
			value: '$100',
			title_rights: 'The following privileges will be granted to you:',
			rights: {
				'0': 'Display your Logo and website link on the homepage of the IF official website',
				'1': 'Display your Logo and website link on the settings page of the IF App',
				'2': 'Opportunity to communicate one-on-one with the development team and participate in product improvement'
			},
			title_steps: 'Follow these steps to become a sponsor:',
			steps: {
				'0': 'Open the settings interface within IF, and click the bottom left corner to enter the payment section',
				'1': 'If you have not registered an account, you will be prompted that payment requires account registration',
				'2': 'After completing the account registration, click to select the sponsor payment plan for payment',
				'3': 'After the payment is completed, copy your uid in the user interface in settings',
				'4': 'Send your uid, logo, and the link with safe content to sponsor@openages.com',
				'5': '15 days later, your logo and link will be displayed on the official website and in the App'
			},
			btn_text: 'Become Sponsor',
			extra: 'Limited to 60 seats.'
		},
		infinity: {
			type: 'Infinity',
			extra: 'Permanent users include all the features of the professional version and can use them for free permanently. Permanent users can only be obtained by participating in the KOL/KOC plan.',
			join: 'Join'
		}
	},
	Note: {
		show_heading_text: {
			title: 'Show Heading Level',
			desc: 'Show heading level on the left side of the heading'
		},
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
	},
	User: {
		free: {
			title: 'Free',
			desc: 'Restrictions'
		},
		pro: {
			title: 'Pro',
			desc: 'Unlimited'
		},
		infinity: {
			title: 'Infinity',
			desc: 'Full Features'
		},
		max: {
			title: 'Max',
			desc: 'Cloud Services'
		},
		sponsor: {
			title: 'Sponsor',
			desc: 'User seats'
		},
		gold_sponsor: {
			title: 'Gold Sponsor',
			desc: '1 to 1 support'
		},
		team: {
			title: 'Team',
			desc: 'Collaboration'
		}
	},
	Tutotial: {
		learn_features: 'IF Features',
		learn_todo: 'How to use Todo',
		learn_note: 'How to use Note',
		learn_pomo: 'How to use Pomo',
		learn_schedule: 'How to use Schedule'
	},
	Backup: {
		title: 'Backup',
		export: {
			title: 'Export',
			desc: 'Export file as backup',
			loading: 'Exporting'
		},
		import: {
			title: 'Import',
			desc: 'Import previously exported backup file',
			loading: 'Importing',
			error: 'An error occurred, please check whether the imported data is correct'
		}
	},
	Update: {
		title: 'Version Update',
		subtitle: 'Update',
		desc: 'Current version',
		btn_update: 'Check update',
		btn_download: 'Download',
		no_update: 'The latest version of IF is currently in use',
		has_update: 'New version detected',
		downloading: 'Downloading new version',
		downloaded: 'Content has been downloaded, restart to install',
		btn_install: 'Install'
	}
}
