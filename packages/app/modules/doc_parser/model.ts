import to from 'await-to-js'
import dayjs from 'dayjs'
import { convertToHtml } from 'mammoth'
import { makeAutoObservable } from 'mobx'
import { injectable } from 'tsyringe'

import { downloadFile, downloadFilesZip, getJson, hono } from '@/utils'
import importMdToNote from '@/utils/importMdToNote'

@injectable()
export default class Index {
	loading = false
	mds = [] as Array<{ name: string; content: string }>

	constructor() {
		makeAutoObservable(this, {}, { autoBind: true })
	}

	init() {}

	onChangeMd(index: number, value: string) {
		this.mds[index].content = value
	}

	onRemove(index: number) {
		this.mds.splice(index, 1)
	}

	save(type: 'fs' | 'note') {
		const files = this.mds.map(item => {
			const blob = new Blob([item.content], { type: 'text/markdown' })
			const file = new File([blob], `${item.name}.md`, { type: 'text/markdown' })

			return file
		})

		if (type === 'fs') {
			if (this.mds.length > 1) {
				downloadFilesZip(files, `parsed_mds_${dayjs().format('YYYY-MM-DD_HH_mm_ss')}`)
			} else {
				const md = this.mds[0]

				downloadFile(md.name, md.content, '.md', 'text/markdown')
			}
		} else {
			importMdToNote(files)
		}
	}

	async onDrop(files: Array<File>) {
		this.loading = true

		for (const [index, item] of files.entries()) {
			if (item.name.indexOf('.docx') !== -1) {
				const { value } = await convertToHtml({ arrayBuffer: await item.arrayBuffer() })

				const blob = new Blob([value], { type: 'text/html' })
				const file = new File([blob], item.name.replace('.docx', '.html'), { type: 'text/html' })

				files[index] = file
			}
		}

		const [err, res_raw] = await to(hono.toMarkdown.$post({ form: { files } }))

		this.loading = false

		if (err || !res_raw) return $message.error($t('common.error') + ': ' + err?.message)

		const res = await getJson(res_raw)

		if (res.error) return $message.error($t(`doc_parser.${res.error}`))

		this.mds = res.data
	}

	on() {}

	off() {}
}
