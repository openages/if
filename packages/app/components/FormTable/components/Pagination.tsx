import { Pagination } from 'antd'

import styles from '../index.css'

import type { IPropsPagination } from '../types'

const Index = (props: IPropsPagination) => {
	return <Pagination className={styles.Pagination} {...props}></Pagination>
}

export default $app.memo(Index)
