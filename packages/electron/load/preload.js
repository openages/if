process.env['ELECTRON_DISABLE_SECURITY_WARNINGS'] = 'true'

const { contextBridge, ipcRenderer } = require('electron')

contextBridge.exposeInMainWorld('$shell', {
	type: 'electron',
	platform: process.platform,
	stopLoading: function () {
		ipcRenderer.send('stop-loading')
	}
})
