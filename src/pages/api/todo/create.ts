import { Todo } from '@prisma/client'
import { NextApiRequest, NextApiResponse } from 'next'
import { z } from 'zod'
import { prisma } from '~/pages/utils/prisma'

const createTodoValidator = z.object({ text: z.string() })
export type CreateTodoRequest = z.infer<typeof createTodoValidator>
export interface CreateTodoResponse {
  error?: string
  data: Todo
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    const request = createTodoValidator.parse(req.body)
    await prisma.todo.create({ data: request })
    res.status(200).end()
  } catch (error) {
    res.status(400).end()
  }
}
