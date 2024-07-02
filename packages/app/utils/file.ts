export const fileToBase64 = (file: Blob): Promise<string> => {
	return new Promise((resolve, reject) => {
		const reader = new FileReader()

		reader.onload = () => {
			resolve(reader.result as string)
		}

		reader.onerror = () => {
			reject(reader.error)
		}

		reader.readAsDataURL(file)
	})
}

export const downloadFile = (filename: string, text: string, ext: string, mime_type?: string) => {
	const blob = new Blob([text], { type: mime_type ?? 'text/plain;charset=utf-8' })
	const url = URL.createObjectURL(blob)

	const link = document.createElement('a')

	link.style.display = 'none'
	link.href = url
	link.download = `${filename}.${ext}`

	document.body.appendChild(link)

	link.click()

	document.body.removeChild(link)

	URL.revokeObjectURL(url)
}
