import { FunctionComponent, useState } from 'react'
import { useCreateTodo } from '~/hooks/todo'

interface CreateTodoProps {}
export const CreateTodo: FunctionComponent<CreateTodoProps> = () => {
  const [newText, setNewText] = useState('')
  const { mutate: createTodo } = useCreateTodo()

  return (
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
  )
}
