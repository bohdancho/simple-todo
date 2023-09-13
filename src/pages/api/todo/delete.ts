import { NextApiRequest, NextApiResponse } from 'next'
import { z } from 'zod'
import { prisma } from '~/utils/prisma'

const paramsValidator = z.object({ id: z.string() })

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    const { id } = paramsValidator.parse(req.query)
    await prisma.todo.delete({ where: { id: Number(id) } })
    res.status(200).end()
  } catch (error) {
    res.status(400).end()
  }
}
