import { spawn } from 'child_process'
import Watchman from 'fb-watchman'
import { resolve } from 'path'

import type { ChildProcessWithoutNullStreams } from 'child_process'

const client = new Watchman.Client()

client.capabilityCheck({ optional: [], required: ['relative_root'] }, (err, _) => {
	if (err) return client.end()

	const path = resolve(`dist`)

	client.command(['watch-project', path], (err, res) => {
		if (err) {
			console.error('Error setting up watch', err)

			return client.end()
		}

		client.command(
			[
				'subscribe',
				res.watch,
				'watch_dist',
				{
					expression: ['allof', ['match', '*.js']],
					fields: ['name', 'size', 'mtime_ms', 'exists', 'type'],
					relative_root: res.relative_path
				}
			],
			(err) => {
				if (!err) return

				console.error('Failed to subscribe:', err)

				return client.end()
			}
		)
	})
})

let electron_child_process: ChildProcessWithoutNullStreams

client.on('subscription', (res) => {
	if (res.subscription !== 'watch_dist') return

	if (electron_child_process) electron_child_process.kill()

	electron_child_process = spawn('electron', ['.'])

	electron_child_process.stdout.on('data', (res) => console.log(res.toString()))
})
