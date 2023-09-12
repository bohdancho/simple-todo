import { useEffect, useState } from 'react'
import { CreateTodoRequest } from './api/todo/create'
import { GetTodosResponse } from './api/todo/getAll'

export default function Home() {
  const [todos, setTodos] = useState<null | GetTodosResponse>(null)
  const [newTodoText, setNewTodoText] = useState('')

  useEffect(() => {
    fetch('/api/todo/getAll')
      .then((res) => res.json())
      .then((data) => setTodos(data))
  }, [])

  const createTodo = () => {
    const payload: CreateTodoRequest = { text: newTodoText }
    const fakeId = Math.random()
    const optimisticTodo = { ...payload, id: fakeId, completed: false }

    setTodos((prev) => prev && [...prev, optimisticTodo])
    fetch('/api/todo/create', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    }).then(undefined, () => setTodos((prev) => prev && prev.filter((todo) => todo.id !== fakeId)))
  }

  return (
    <main className='flex h-screen items-center justify-center'>
      <div>
        <h1 className='text-5xl'>Your list of todos</h1>
        <div>
          <button type='button' className='btn' onClick={createTodo}>
            create new todo
          </button>
          <input
            type='text'
            className='input border-2 border-slate-800'
            value={newTodoText}
            onChange={(e) => setNewTodoText(e.target.value)}
          />
        </div>
        <div>{todos ? todos.map((todo) => <div key={todo.id}>{todo.text}</div>) : 'Loading'}</div>
      </div>
    </main>
  )
}
