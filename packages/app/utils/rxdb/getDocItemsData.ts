import type { RxDB } from '@/types'

export default <T>(arr:RxDB.ItemsDoc<T>) => {
      return arr.map((item) => item.toMutableJSON())
}