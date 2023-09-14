import { useMutation } from '@tanstack/react-query'
import { API_PREFIX_TODO } from '~/constants'
import { queryClient } from '~/pages'
import { GetTodosResponse } from '~/pages/api/todo/getAll'
import { UpdateTodoPayload } from '~/pages/api/todo/update'

function updateTodo({ payload, id }: { payload: UpdateTodoPayload; id: number }) {
  return fetch(API_PREFIX_TODO + '/update?id=' + id, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  })
}

export const useUpdateTodo = () =>
  useMutation({
    mutationFn: updateTodo,
    onMutate: async ({ id, payload }) => {
      await queryClient.cancelQueries({ queryKey: ['todos'] })
      const previousTodos = queryClient.getQueryData(['todos'])

      queryClient.setQueryData<GetTodosResponse>(
        ['todos'],
        (old) => old?.map((todo) => (todo.id === id ? { ...todo, ...payload } : todo)),
      )
      return { previousTodos }
    },
    onError: (_err, _newTodo, context) => {
      queryClient.setQueryData(['todos'], context && context.previousTodos)
    },
    onSuccess: () => queryClient.invalidateQueries(['todos']),
  })
