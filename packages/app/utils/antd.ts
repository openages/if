export const confirm = async ({ id, title, content }: { id?: string; title: string; content: string }) => {
	return new Promise(resolve => {
		$modal.confirm({
			title,
			content,
			centered: true,
			getContainer: () => (id ? document.getElementById(id) : document.body),
			onOk() {
				resolve(true)
			},
			onCancel() {
				resolve(false)
			}
		})
	})
}

export const info = async ({ id, title, content }: { id?: string; title: string; content: string }) => {
	return new Promise(resolve => {
		$modal.info({
			title,
			content,
			centered: true,
			getContainer: () => (id ? document.getElementById(id) : document.body),
			onOk() {
				resolve(true)
			}
		})
	})
}
