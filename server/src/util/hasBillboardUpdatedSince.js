import getLastMonday from './getLastMonday.js'

export default (timestamp) => getLastMonday(new Date()).getTime() > timestamp
