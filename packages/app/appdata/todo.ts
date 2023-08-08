import type { Todo } from '@/types'

export const getTodoDefaultData = () => {
      // @ts-ignore
      const angles = $t('translation:todo.default_angles', { returnObjects: true })
      
	return {
		angles ,
		angle: angles[0],
		tags: [],
		settings: {
			auto_archiving: '3m'
		}
	} as Pick<Todo.Data, 'angles' | 'angle' | 'tags' | 'settings'>
}
