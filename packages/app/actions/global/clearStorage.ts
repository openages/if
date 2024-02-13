export default () => {
	window.localStorage.clear()
	window.sessionStorage.clear()

	window.location.reload()
}
