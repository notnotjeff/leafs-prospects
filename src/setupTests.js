import '@testing-library/jest-dom/extend-expect'
import 'jest-axe/extend-expect'
import { configure } from '@testing-library/react'
import { queryCache } from 'react-query'

configure({ defaultHidden: true })

afterEach(async () => {
  queryCache.clear()
})
