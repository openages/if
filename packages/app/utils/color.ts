import Color from 'color'

export const getTextColor = (v: string) => (Color(v).isDark() ? 'white' : 'black')

export const getTagColor = (color: string) => {
	return {
		bg_color: Color(color).alpha(0.48).lighten(0.6).saturationl(90).saturationv(30).toString(),
		text_color: Color(color).saturationl(0).saturationv(100).chroma(36).toString()
	}
}
