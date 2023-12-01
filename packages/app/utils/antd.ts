export const confirm = async ({ title, content }: { title: string; content: string }) => {
	return new Promise(resolve => {
		$modal.confirm({
			title,
			content,
			centered: true,
			onOk() {
				resolve(true)
			},
			onCancel() {
				resolve(false)
			}
		})
	})
}
