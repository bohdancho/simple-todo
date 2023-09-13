import { NextApiRequest, NextApiResponse } from 'next'
import { z } from 'zod'
import { prisma } from '~/utils/prisma'

const paramsValidator = z.object({ id: z.string() })
const payloadValidator = z.object({ completed: z.boolean() })
export type UpdateTodoPayload = z.infer<typeof payloadValidator>

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    const { id } = paramsValidator.parse(req.query)
    const request = payloadValidator.parse(req.body)
    await prisma.todo.update({ where: { id: Number(id) }, data: request })
    res.status(200).end()
  } catch (error) {
    res.status(400).end()
  }
}
