import { Todo } from '@prisma/client'
import { NextApiRequest, NextApiResponse } from 'next'
import { prisma } from '~/utils/prisma'

export type GetTodosResponse = Todo[]

export default async function handler(req: NextApiRequest, res: NextApiResponse<GetTodosResponse>) {
  const todos = await prisma.todo.findMany()
  res.status(200).json(todos)
}
