import { Todo } from '@prisma/client'
import { FunctionComponent } from 'react'
import { useDeleteTodo, useGetTodos, useUpdateTodo } from '~/hooks/todo'
import { TodoItem } from './TodoItem'

interface TodoListProps {}
export const TodoList: FunctionComponent<TodoListProps> = () => {
  const { data: todos } = useGetTodos()
  const { mutate: deleteTodo } = useDeleteTodo()
  const { mutate: updateTodo } = useUpdateTodo()

  return (
    <div className='flex flex-col gap-1'>
      {todos !== undefined
        ? todos
            .sort(sortById)
            .map(({ id, text, completed }) => (
              <TodoItem
                text={text}
                completed={completed}
                toggleCompleted={() => updateTodo({ payload: { completed: !completed }, id })}
                onDelete={() => deleteTodo({ id })}
                key={id}
              />
            ))
        : 'Loading'}
    </div>
  )
}

export const API_PREFIX = '/api/todo/'

function sortById(a: Todo, b: Todo) {
  return b.id - a.id
}
