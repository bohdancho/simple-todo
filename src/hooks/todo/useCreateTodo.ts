import { useMutation } from '@tanstack/react-query'
import { API_PREFIX_TODO, TODO_QUERY_KEY } from '~/constants'
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
      await queryClient.cancelQueries({ queryKey: [TODO_QUERY_KEY] })
      const previousTodos = queryClient.getQueryData([TODO_QUERY_KEY])

      const optimisticTodo = { ...newTodo, id: fakeId(), completed: false }
      queryClient.setQueryData<GetTodosResponse>([TODO_QUERY_KEY], (old) => old && [...old, optimisticTodo])
      return { previousTodos }
    },
    onError: (_err, _newTodo, context) => {
      queryClient.setQueryData([TODO_QUERY_KEY], context && context.previousTodos)
    },
    onSuccess: () => queryClient.invalidateQueries([TODO_QUERY_KEY]),
  })
