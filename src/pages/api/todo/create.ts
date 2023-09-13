import { Todo } from '@prisma/client'
import { NextApiRequest, NextApiResponse } from 'next'
import { z } from 'zod'
import { prisma } from '~/utils/prisma'

const createTodoValidator = z.object({ text: z.string() })
export type CreateTodoPayload = z.infer<typeof createTodoValidator>
export type CreateTodoResponse = Todo

export default async function handler(req: NextApiRequest, res: NextApiResponse<CreateTodoResponse>) {
  try {
    const request = createTodoValidator.parse(req.body)
    const todo = await prisma.todo.create({ data: request })
    res.status(200).json(todo)
  } catch (error) {
    res.status(400).end()
  }
}
