import { Todo } from '@prisma/client'
import dayjs from 'dayjs'
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
            .sort(sortByCreated)
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

function sortByCreated(a: Todo, b: Todo) {
  return dayjs(b.createdAt).valueOf() - dayjs(a.createdAt).valueOf()
}
