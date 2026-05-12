import { FastifyRequest, FastifyReply } from 'fastify'
import { db } from '../../lib/db'

export async function getEvents(request: FastifyRequest, reply: FastifyReply) {
  const { data, error } = await db.from('events').select('*')

  if (error) {
    return reply.status(500).send({ error: error.message })
  }

  return reply.send({ data: data ?? [] })
}
