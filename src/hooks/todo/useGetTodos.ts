import { useQuery } from '@tanstack/react-query'
import { API_PREFIX } from '~/components/todo/TodoList'
import { GetTodosResponse } from '~/pages/api/todo/getAll'

const getTodos = async (): Promise<GetTodosResponse> => {
  const res = await fetch(API_PREFIX + '/getAll')
  return await res.json()
}
export const useGetTodos = () => {
  const { data: todos } = useQuery({ queryKey: ['todos'], queryFn: getTodos })
  return { todos }
}
