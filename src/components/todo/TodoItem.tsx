import { FunctionComponent } from 'react'

interface TodoItemProps {
  text: string
  completed: boolean
  toggleCompleted: () => void
  onDelete: () => void
}

export const TodoItem: FunctionComponent<TodoItemProps> = ({ text, completed, toggleCompleted, onDelete }) => {
  return (
    <label className='flex cursor-pointer gap-[10px]'>
      <button onClick={onDelete}>❌</button>
      <input type='checkbox' checked={completed} onChange={toggleCompleted} className='checkbox' />
      <div>{text}</div>
    </label>
  )
}
