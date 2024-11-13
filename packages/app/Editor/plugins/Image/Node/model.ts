import { $getNodeByKey } from 'lexical'
import { makeAutoObservable } from 'mobx'
import { injectable } from 'tsyringe'

import { Block } from '@/Editor/models'

import type ImageNode from './index'
import type { FocusEvent, CSSProperties } from 'react'

@injectable()
export default class Index {
	show_error = false

	constructor(public block: Block) {
		makeAutoObservable(this, { block: false }, { autoBind: true })
	}

	onChangeSrc(e: FocusEvent<HTMLInputElement>) {
		e.preventDefault()

		if (!e.target.value) return

		this.block.editor.update(() => {
			const node = $getNodeByKey(this.block.key)!
			const target = node.getWritable() as ImageNode

			if (e.target.value === target.__src) return

			target.__src = e.target.value
		})
	}

	onChangeAlt(e: FocusEvent<HTMLInputElement>) {
		e.preventDefault()

		this.block.editor.update(() => {
			const node = $getNodeByKey(this.block.key)!
			const target = node.getWritable() as ImageNode

			if (e.target.value === target.__alt) return

			target.__alt = e.target.value
		})
	}

	onChangeAlign(v: CSSProperties['justifyContent']) {
		this.block.editor.update(() => {
			const node = $getNodeByKey(this.block.key)!
			const target = node.getWritable() as ImageNode

			target.__align = v
		})
	}

	onChangeObjectFit(v: CSSProperties['objectFit']) {
		this.block.editor.update(() => {
			const node = $getNodeByKey(this.block.key)!
			const target = node.getWritable() as ImageNode

			target.__object_fit = v
		})
	}

	onChangeSize(type: 'width' | 'height', v: string) {
		this.block.editor.update(() => {
			const node = $getNodeByKey(this.block.key)!
			const target = node.getWritable() as ImageNode

			if (type === 'width') target.__width = Number.isNaN(Number(v)) ? v : Number(v)
			if (type === 'height') target.__height = Number.isNaN(Number(v)) ? v : Number(v)
		})
	}

	onReset() {
		this.block.editor.update(() => {
			const node = $getNodeByKey(this.block.key)!
			const target = node.getWritable() as ImageNode

			target.__width = undefined as unknown as string
			target.__height = undefined as unknown as string
			target.__align = 'center'
			target.__object_fit = undefined
		})
	}
}
