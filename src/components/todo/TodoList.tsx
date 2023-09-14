import { Todo } from '@prisma/client'
import { FunctionComponent, useState } from 'react'
import { useCreateTodo, useDeleteTodo, useGetTodos, useUpdateTodo } from '~/hooks/todo'
import { TodoItem } from './TodoItem'

interface TodoListProps {}
export const TodoList: FunctionComponent<TodoListProps> = () => {
  const [newText, setNewText] = useState('')

  const { data: todos } = useGetTodos()
  const { mutate: createTodo } = useCreateTodo()
  const { mutate: deleteTodo } = useDeleteTodo()
  const { mutate: updateTodo } = useUpdateTodo()

  return (
    <div>
      <h1 className='mb-5 text-5xl'>Your list of todos</h1>
      <div>
        <button type='button' className='btn mb-3' onClick={() => createTodo({ text: newText })}>
          create new todo
        </button>
        <input
          type='text'
          className='input border-2 border-slate-800'
          value={newText}
          onChange={(e) => setNewText(e.target.value)}
          onKeyDown={(e) => (e.key === 'Enter' ? createTodo({ text: newText }) : null)}
        />
      </div>
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
    </div>
  )
}

export const API_PREFIX = '/api/todo/'

function sortById(a: Todo, b: Todo) {
  return b.id - a.id
}
