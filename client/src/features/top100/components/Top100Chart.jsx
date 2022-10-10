import { Chart } from '../../../components/chart/Chart'
import { useTop100 } from '../hooks/useTop100'

export const Top100Chart = () => {
	const songs = useTop100()
	return <Chart songs={songs} />
}
