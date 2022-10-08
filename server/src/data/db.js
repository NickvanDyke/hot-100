import fs from 'fs'

export default (pg) => ({
	q: (path, args) => pg.query(fs.readFileSync('./sql/' + path + '.psql').toString(), args).then((res) => res.rows)
})
