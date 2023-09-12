import { Todo } from '@prisma/client'
import { NextApiRequest, NextApiResponse } from 'next'
import { prisma } from '~/pages/utils/prisma'

export type GetTodosResponse = Todo[]

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const todos: GetTodosResponse = await prisma.todo.findMany()
  res.status(200).json(todos)
}
