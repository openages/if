import { Record } from '@phosphor-icons/react'

import feather_icons_data from './feather_icons_data'
import ionicons_data from './ionicons_data'

type Icon = {
	id: string
	name: string
	keywords: Array<string>
	skins: Array<{ src: string }>
}

export const feather_icons = Object.keys(feather_icons_data).reduce(
	(total, key) => {
		const target = {
			id: key,
			name: key,
			keywords: feather_icons_data[key],
			skins: [{ src: `/feather_icons/${key}.svg` }]
		}

		total.icon_array.push(target)
		total.icon_object[key] = target

		return total
	},
	{
		icon_array: [] as Array<Icon>,
		icon_object: {} as Record<string, Icon>
	}
)

export const ionicons = ionicons_data.reduce(
	(total, item) => {
		const target = {
			id: item.name,
			name: item.name,
			keywords: item.tags,
			skins: [{ src: `/ionicons/${item.name}.svg` }]
		}

		total.icon_array.push(target)
		total.icon_object[item.name] = target

		return total
	},
	{
		icon_array: [] as Array<Icon>,
		icon_object: {} as Record<string, Icon>
	}
)

export default {
	icon_array: feather_icons.icon_array.concat(ionicons.icon_array),
	icon_object: { ...feather_icons.icon_object, ...ionicons.icon_object }
}
