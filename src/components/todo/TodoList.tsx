import { Todo } from '@prisma/client'
import { FunctionComponent, useEffect, useState } from 'react'
import { CreateTodoPayload } from '~/pages/api/todo/create'
import { GetTodosResponse } from '~/pages/api/todo/getAll'
import { UpdateTodoPayload } from '~/pages/api/todo/update'
import { TodoItem } from './TodoItem'

interface TodoListProps {}
const TodoList: FunctionComponent<TodoListProps> = () => {
  const [todos, setTodos] = useState<null | Todo[]>(null)
  const [newText, setNewText] = useState('')

  useEffect(() => {
    getTodos().then((response) => setTodos(response))
  }, [])

  const createHandler = () => {
    const payload: CreateTodoPayload = { text: newText }
    const fakeId = Math.random()
    const optimisticTodo = { ...payload, id: fakeId, completed: false }
    const optimisticUpdate = () => setTodos((prev) => prev && [...prev, optimisticTodo])
    const revertOptimistic = () => setTodos((prev) => prev && prev.filter((todo) => todo.id !== fakeId))

    optimisticUpdate()
    createTodo(payload).catch(revertOptimistic)
  }

  const updateHandler = ({ completed, id }: Todo) => {
    const payload: UpdateTodoPayload = { completed: !completed }
    const oldValue = completed
    const optimisticUpdate = () =>
      setTodos(
        (prev) => prev && prev.map((todo) => (todo.id === id ? { ...todo, completed: payload.completed } : todo)),
      )
    const revertOptimistic = () =>
      setTodos((prev) => prev && prev.map((todo) => (todo.id === id ? { ...todo, completed: oldValue } : todo)))

    optimisticUpdate()
    updateTodo(payload, id).catch(revertOptimistic)
  }

  return (
    <div>
      <h1 className='mb-5 text-5xl'>Your list of todos</h1>
      <div>
        <button type='button' className='btn mb-3' onClick={createHandler}>
          create new todo
        </button>
        <input
          type='text'
          className='input border-2 border-slate-800'
          value={newText}
          onChange={(e) => setNewText(e.target.value)}
        />
      </div>
      <div className='flex flex-col gap-1'>
        {todos
          ? todos
              .sort(sortById)
              .map((todo) => (
                <TodoItem
                  text={todo.text}
                  completed={todo.completed}
                  toggleCompleted={() => updateHandler(todo)}
                  key={todo.id}
                />
              ))
          : 'Loading'}
      </div>
    </div>
  )
}

function getTodos(): Promise<GetTodosResponse> {
  return fetch('/api/todo/getAll').then((res) => res.json())
}

function createTodo(payload: CreateTodoPayload) {
  return fetch('/api/todo/create', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  })
}

function updateTodo(payload: UpdateTodoPayload, id: number) {
  return fetch('/api/todo/update?id=' + id, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  })
}

function sortById(a: Todo, b: Todo) {
  return b.id - a.id
}

export default TodoList
