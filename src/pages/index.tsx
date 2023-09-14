import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { ReactQueryDevtools } from '@tanstack/react-query-devtools'
import { CreateTodo, TodoList } from '~/components/todo'

export const queryClient = new QueryClient()

export default function Home() {
  return (
    <QueryClientProvider client={queryClient}>
      <main className='flex h-screen items-center justify-center'>
        <div>
          <h1 className='mb-5 text-5xl'>Your list of todos</h1>
          <CreateTodo />
          <TodoList></TodoList>
        </div>
      </main>
      <ReactQueryDevtools initialIsOpen={false} />
    </QueryClientProvider>
  )
}
