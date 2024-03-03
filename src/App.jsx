import AnecdoteForm from './components/AnecdoteForm'
import Notification from './components/Notification'
import { useNotificationDispatch } from './NotificationContext'
import { getAllAnecdotes, updateAnecdote } from './requests'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'

const App = () => {
  const queryClient = useQueryClient()
  const result = useQuery({
    queryKey: ['anecdotes'],
    queryFn: getAllAnecdotes,
    retry: 1,
    refetchOnWindowFocus: false
  })

  const updateAnecdoteMutation = useMutation({
    mutationFn: updateAnecdote,
    onSuccess: data => {
      queryClient.setQueryData(['anecdotes'], prevAnecdotes =>
        prevAnecdotes.map(anec => (anec.id !== data.id ? anec : data))
      )
    }
  })

  const notificationDispatch = useNotificationDispatch()

  const handleVote = anecdote => {
    updateAnecdoteMutation.mutate({
      ...anecdote,
      votes: anecdote.votes + 1
    })

    notificationDispatch({
      type: 'NOTI',
      payload: `Anecdote ${anecdote.content} voted`
    })
    setTimeout(() => {
      notificationDispatch({ type: 'NULL' })
    }, 5000)
  }

  const anecdotes = result.data

  if (result.isPending) {
    return <span>Loading...</span>
  }

  if (result.isError) {
    return <span>Anecdote service not available due to problems in server</span>
  }

  return (
    <div>
      <h3>Anecdote app</h3>
      <Notification />
      <AnecdoteForm />

      {anecdotes.map(anecdote => (
        <div key={anecdote.id}>
          <div>{anecdote.content}</div>
          <div>
            has {anecdote.votes}
            <button onClick={() => handleVote(anecdote)}>vote</button>
          </div>
        </div>
      ))}
    </div>
  )
}

export default App
