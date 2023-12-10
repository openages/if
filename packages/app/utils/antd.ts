export const confirm = async ({ id, title, content }: { id: string; title: string; content: string }) => {
	return new Promise(resolve => {
		$modal.confirm({
			title,
			content,
			centered: true,
			getContainer: () => document.getElementById(id),
			onOk() {
				resolve(true)
			},
			onCancel() {
				resolve(false)
			}
		})
	})
}
