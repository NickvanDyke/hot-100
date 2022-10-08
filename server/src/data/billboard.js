import { getChart } from 'billboard-top-100'

export function getTop100() {
	return new Promise((resolve, reject) => {
		getChart((err, chart) => {
			if (err) reject(err)
			else resolve(chart)
		})
	})
}
