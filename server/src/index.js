import { exit } from 'process'
import build from './server.js'
import dotenv from 'dotenv'
import path from 'path'
dotenv.config({ path: path.resolve(process.cwd(), '..', '.env') })

const fastify = await build({
	pgConnectionString: process.env.POSTGRES_URL,
	forceMigration: true,
	logger: {
		level: 'info',
	},
})

fastify.listen({ port: process.env.PORT }, (err, address) => {
	if (err) {
		fastify.log.error(err)
		exit(1)
	}
	console.log(`Server listening at ${address}`)
})
