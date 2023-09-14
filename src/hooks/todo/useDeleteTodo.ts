import { Todo } from '@prisma/client'
import { useMutation } from '@tanstack/react-query'
import { API_PREFIX } from '~/components/todo'
import { queryClient } from '~/pages'

function deleteTodo({ id }: { id: number }) {
  return fetch(API_PREFIX + '/delete?id=' + id, { method: 'DELETE' })
}

export const useDeleteTodo = () =>
  useMutation({
    mutationFn: deleteTodo,
    onMutate: async ({ id }) => {
      await queryClient.cancelQueries({ queryKey: ['todos'] })
      const previousTodos = queryClient.getQueryData(['todos'])

      queryClient.setQueryData<Todo[]>(['todos'], (old) => old && old.filter((todo) => todo.id !== id))
      return { previousTodos }
    },
    onError: (_err, _newTodo, context) => {
      queryClient.setQueryData(['todos'], context && context.previousTodos)
    },
    onSuccess: () => queryClient.invalidateQueries(['todos']),
  })
