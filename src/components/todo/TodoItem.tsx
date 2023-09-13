import { FunctionComponent } from 'react'

interface TodoItemProps {
  text: string
  completed: boolean
  toggleCompleted: () => void
}

export const TodoItem: FunctionComponent<TodoItemProps> = ({ text, completed, toggleCompleted }) => {
  return (
    <label className='flex gap-[10px]'>
      <input type='checkbox' checked={completed} onChange={toggleCompleted} className='checkbox' />
      <div>{text}</div>
    </label>
  )
}
