import { useQuery } from 'react-query'

const fetchGames = async () => {
  const response = await fetch(`${process.env.REACT_APP_API_URL}/games`)
  const { data } = await response.json()

  return data
}

const useGames = () => {
  return useQuery('games', fetchGames)
}

export { useGames }
