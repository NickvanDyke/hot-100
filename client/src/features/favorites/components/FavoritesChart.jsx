import { Chart } from '../../../components/chart/Chart'
import { useFavorites } from '../hooks/useFavorites'

export const FavoritesChart = () => {
	const favorites = useFavorites()
	return <Chart songs={favorites} />
}