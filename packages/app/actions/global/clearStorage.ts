export default () => {
	window.localStorage.clear()
	window.sessionStorage.clear()

	$app.Event.emit('global.app.relaunch')
}
