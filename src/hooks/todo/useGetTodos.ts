import { useQuery } from '@tanstack/react-query'
import { API_PREFIX_TODO, TODO_QUERY_KEY } from '~/constants'
import { GetTodosResponse } from '~/pages/api/todo/getAll'

const getTodos = async (): Promise<GetTodosResponse> => {
  const res = await fetch(API_PREFIX_TODO + '/getAll')
  return await res.json()
}
export const useGetTodos = () => useQuery({ queryKey: [TODO_QUERY_KEY], queryFn: getTodos })
