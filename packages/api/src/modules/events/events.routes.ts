import { FastifyInstance } from 'fastify'
import { getEvents } from './events.controller'

export async function eventsRoutes(app: FastifyInstance) {
  app.get('/events', getEvents)
}
