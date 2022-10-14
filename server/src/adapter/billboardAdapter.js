import { getChart } from 'billboard-top-100'

export default () => ({
	getLatestTop100: () => {
		return new Promise((resolve, reject) => {
			getChart((err, chart) => {
				if (err) reject(err)
				else resolve(chart.songs)
			})
		})
	},
})
