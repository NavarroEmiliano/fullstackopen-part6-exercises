import axios from 'axios'
const baseUrl = 'http://localhost:3001/anecdotes'

export const getAllAnecdotes = async () => {
  const { data } = await axios.get(baseUrl)
  return data
}
