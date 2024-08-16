if (window.$shell?.type === 'electron') {
	setTimeout(() => window.$shell?.stopLoading(), 600)
}
