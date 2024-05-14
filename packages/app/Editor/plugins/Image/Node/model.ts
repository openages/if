import { makeAutoObservable } from 'mobx'
import { injectable } from 'tsyringe'

import { Block } from '@/Editor/models'

import type { FocusEvent, CSSProperties } from 'react'
import type ImageNode from './index'

@injectable()
export default class Index {
	constructor(public block: Block<ImageNode>) {
		makeAutoObservable(this, { block: false }, { autoBind: true })
	}

	onChangeSrc(e: FocusEvent<HTMLInputElement>) {
		e.preventDefault()

		if (!e.target.value) return

		this.block.editor.update(() => {
			const target = this.block.node.getWritable()

			if (e.target.value === target.__src) return

			target.__src = e.target.value
		})
	}

	onChangeAlt(e: FocusEvent<HTMLInputElement>) {
		e.preventDefault()

		this.block.editor.update(() => {
			const target = this.block.node.getWritable()

			if (e.target.value === target.__alt) return

			target.__alt = e.target.value
		})
	}

	onChangeAlign(v: CSSProperties['justifyContent']) {
		this.block.editor.update(() => {
			const target = this.block.node.getWritable()

			target.__align = v
		})
	}

	onChangeObjectFit(v: CSSProperties['objectFit']) {
		this.block.editor.update(() => {
			const target = this.block.node.getWritable()

			target.__object_fit = v
		})
	}

	onChangeSize(type: 'width' | 'height', v: string) {
		this.block.editor.update(() => {
			const target = this.block.node.getWritable()

			if (type === 'width') target.__width = typeof Number(v) === 'number' ? Number(v) : v
			if (type === 'height') target.__height = typeof Number(v) === 'number' ? Number(v) : v
		})
	}

	onReset() {
		this.block.editor.update(() => {
			const target = this.block.node.getWritable()

			target.__width = undefined
			target.__height = undefined
			target.__align = 'center'
			target.__object_fit = undefined
		})
	}
}
