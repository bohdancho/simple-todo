import { Todo } from '@prisma/client'
import { FunctionComponent, useState } from 'react'
import { useCreateTodo, useDeleteTodo, useGetTodos } from '~/hooks/todo'
import { CreateTodoPayload, CreateTodoResponse } from '~/pages/api/todo/create'
import { UpdateTodoPayload } from '~/pages/api/todo/update'
import { TodoItem } from './TodoItem'

interface TodoListProps {}
export const TodoList: FunctionComponent<TodoListProps> = () => {
  const [newText, setNewText] = useState('')

  const { data: todos } = useGetTodos()
  const { mutate: createTodo } = useCreateTodo()
  const { mutate: deleteTodo } = useDeleteTodo()

  const updateHandler = ({ completed, id }: Todo) => {}

  const deleteHandler = (todo: Todo) => {}

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
              .map((todo) => (
                <TodoItem
                  text={todo.text}
                  completed={todo.completed}
                  toggleCompleted={() => updateHandler(todo)}
                  onDelete={() => deleteTodo({ id: todo.id })}
                  key={todo.id}
                />
              ))
          : 'Loading'}
      </div>
    </div>
  )
}

export const API_PREFIX = '/api/todo/'

function createTodo(payload: CreateTodoPayload): Promise<CreateTodoResponse> {
  return fetch(API_PREFIX + '/create', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  }).then((res) => res.json())
}

function updateTodo(payload: UpdateTodoPayload, id: number) {
  return fetch(API_PREFIX + '/update?id=' + id, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  })
}

function deleteTodo(id: number) {
  return fetch(API_PREFIX + '/delete?id=' + id, { method: 'DELETE' })
}

function sortById(a: Todo, b: Todo) {
  return b.id - a.id
}
