import { useMutation } from '@tanstack/react-query'
import { API_PREFIX_TODO } from '~/constants'
import { queryClient } from '~/pages'
import { GetTodosResponse } from '~/pages/api/todo/getAll'

function deleteTodo({ id }: { id: number }) {
  return fetch(API_PREFIX_TODO + '/delete?id=' + id, { method: 'DELETE' })
}

export const useDeleteTodo = () =>
  useMutation({
    mutationFn: deleteTodo,
    onMutate: async ({ id }) => {
      await queryClient.cancelQueries({ queryKey: ['todos'] })
      const previousTodos = queryClient.getQueryData(['todos'])

      queryClient.setQueryData<GetTodosResponse>(['todos'], (old) => old?.filter((todo) => todo.id !== id))
      return { previousTodos }
    },
    onError: (_err, _newTodo, context) => {
      queryClient.setQueryData(['todos'], context && context.previousTodos)
    },
    onSuccess: () => queryClient.invalidateQueries(['todos']),
  })
