import { useMutation } from '@tanstack/react-query'
import { API_PREFIX_TODO, TODO_QUERY_KEY } from '~/constants'
import { queryClient } from '~/pages'
import { GetTodosResponse } from '~/pages/api/todo/getAll'

function deleteTodo({ id }: { id: number }) {
  return fetch(API_PREFIX_TODO + '/delete?id=' + id, { method: 'DELETE' })
}

export const useDeleteTodo = () =>
  useMutation({
    mutationFn: deleteTodo,
    onMutate: async ({ id }) => {
      await queryClient.cancelQueries({ queryKey: [TODO_QUERY_KEY] })
      const previousTodos = queryClient.getQueryData([TODO_QUERY_KEY])

      queryClient.setQueryData<GetTodosResponse>([TODO_QUERY_KEY], (old) => old?.filter((todo) => todo.id !== id))
      return { previousTodos }
    },
    onError: (_err, _newTodo, context) => {
      queryClient.setQueryData([TODO_QUERY_KEY], context && context.previousTodos)
    },
    onSuccess: () => queryClient.invalidateQueries([TODO_QUERY_KEY]),
  })
