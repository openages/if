import Color from 'color'

export const getTextColor = (v: string) => (Color(v).isDark() ? 'white' : 'black')
