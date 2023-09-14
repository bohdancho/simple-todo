import { useMutation } from '@tanstack/react-query'
import { API_PREFIX_TODO } from '~/constants/apiPrefixes'
import { queryClient } from '~/pages'
import { CreateTodoPayload, CreateTodoResponse } from '~/pages/api/todo/create'
import { GetTodosResponse } from '~/pages/api/todo/getAll'
import { fakeId } from '~/utils/fakeId'

function createTodo(payload: CreateTodoPayload): Promise<CreateTodoResponse> {
  return fetch(API_PREFIX_TODO + '/create', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  }).then((res) => res.json())
}

export const useCreateTodo = () =>
  useMutation({
    mutationFn: createTodo,
    onMutate: async (newTodo) => {
      await queryClient.cancelQueries({ queryKey: ['todos'] })
      const previousTodos = queryClient.getQueryData(['todos'])

      const optimisticTodo = { ...newTodo, id: fakeId(), completed: false }
      queryClient.setQueryData<GetTodosResponse>(['todos'], (old) => old && [...old, optimisticTodo])
      return { previousTodos }
    },
    onError: (_err, _newTodo, context) => {
      queryClient.setQueryData(['todos'], context && context.previousTodos)
    },
    onSuccess: () => queryClient.invalidateQueries(['todos']),
  })
