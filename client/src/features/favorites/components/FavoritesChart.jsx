import { Chart } from '../../../components/chart/Chart'
import { useMyFavorites } from '../hooks/useMyFavorites'

export const FavoritesChart = () => {
	const favorites = useMyFavorites()
	return (
		<Chart
			songs={favorites}
			favoriteIds={favorites?.map((song) => song.id)}
		/>
	)
}
