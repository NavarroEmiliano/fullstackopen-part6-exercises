import { useMutation, useQueryClient } from '@tanstack/react-query'
import { createAnecdote } from '../requests'
import { useNotificationDispatch } from '../NotificationContext'

const AnecdoteForm = () => {
  const queryClient = useQueryClient()
  const notificationDispatch = useNotificationDispatch()

  const newAnecdoteMutation = useMutation({
    mutationFn: createAnecdote,
    onSuccess: data => {
      queryClient.setQueryData(['anecdotes'], prevAnecdotes => [
        ...prevAnecdotes,
        data
      ])
      notificationDispatch({
        type: 'NOTI',
        payload: `Anecdote ${data.content} created`
      })
      setTimeout(() => {
        notificationDispatch({ type: 'NULL' })
      }, 5000)
    },
    onError: (error) => {
      notificationDispatch({
        type: 'NOTI',
        payload: error.response.data.error
      })
      setTimeout(() => {
        notificationDispatch({ type: 'NULL' })
      }, 5000)
    }
  })

  const onCreate = event => {
    event.preventDefault()
    const content = event.target.anecdote.value
    event.target.anecdote.value = ''
    newAnecdoteMutation.mutate({ content, votes: 0 })
  }

  return (
    <div>
      <h3>create new</h3>
      <form onSubmit={onCreate}>
        <input name='anecdote' />
        <button type='submit'>create</button>
      </form>
    </div>
  )
}

export default AnecdoteForm
