import React from 'react'
import { render } from '@testing-library/react'
import ProspectFilters from '../ProspectFilters'

it('renders', () => {
  const { getAllByRole } = render(<ProspectFilters />)
  const filters = getAllByRole('combobox')

  expect(filters.length).toBe(5)
})
