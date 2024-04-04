import { useTranslation } from 'react-i18next'

import { Modal } from '@/components'

import styles from './index.css'

import type { IPropsPayModal } from '../../types'

const Index = (props: IPropsPayModal) => {
	const { user_type, visible_pay_modal, closeModal } = props
	const { t } = useTranslation()

	return (
		<Modal className={styles._local} open={visible_pay_modal} maskClosable={false} onCancel={closeModal}>
			<div className='pay_wrap'>pay</div>
		</Modal>
	)
}

export default $app.memo(Index)
