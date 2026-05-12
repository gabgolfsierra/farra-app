import path from 'path'
import dotenv from 'dotenv'
dotenv.config({ path: path.join(__dirname, '..', '.env') })

import Fastify from 'fastify'
import { eventsRoutes } from './modules/events/events.routes'

const app = Fastify({ logger: true })

app.get('/health', async () => {
  return { status: 'ok', app: 'farra-api' }
})

app.register(eventsRoutes, { prefix: '/api' })

const start = async () => {
  try {
    await app.listen({ port: 3333, host: '0.0.0.0' })
    console.log('🎉 Farra API rodando em http://localhost:3333')
  } catch (err) {
    app.log.error(err)
    process.exit(1)
  }
}

start()
