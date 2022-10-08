import { getLastMonday } from './getLastMonday.js'

export function hasBillboardUpdatedSince(timestamp) {
	return getLastMonday(new Date()).getTime() > timestamp
}
