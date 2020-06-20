import { useQuery } from 'react-query'

const fetchProspects = async () => {
  const response = await fetch(`${process.env.REACT_APP_API_URL}/prospects`)
  const { data } = await response.json()

  return data
}

const useProspects = () => {
  return useQuery('prospects', fetchProspects)
}

export { useProspects }
