import flat from 'flat'

import { dirtree, nav_title, setting, todo } from './en-US/index'

export default flat(
	{
		nav_title,
		setting,
		dirtree,
		todo
	},
	{ safe: true }
)
