import styles from './index.css'

interface IProps {
	data: any
}

const Index = ({ data: { text, color } }: IProps) => {
	return (
		<div className={$cx('w_100 flex align_center', styles._local)}>
			<span className='tag_color mr_6' style={{ backgroundColor: color }}></span>
			<span className='text'>{text.split('|')[0]}</span>
		</div>
	)
}

export default Index
