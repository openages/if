import flat from 'flat'

import { dirtree, nav_title, setting, todo } from './zh-CN/index'

export default flat(
	{
		nav_title,
		setting,
		dirtree,
		todo
	},
	{ safe: true }
)
