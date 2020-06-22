import React from 'react'
import { render, screen, fireEvent } from '@testing-library/react'
import { axe } from 'jest-axe'
import Filter from '../Filter'

it('renders with passed in options', () => {
  const label = 'League:'
  const options = ['Any', 'OHL', 'SHL']
  render(<Filter name="leagues" label={label} options={options} />)

  const input = screen.getByLabelText(label)
  expect(input).not.toBeNull()
  expect(input).toMatchInlineSnapshot(`
    <select
      name="leagues"
    >
      <option
        value="Any"
      >
        Any
      </option>
      <option
        value="OHL"
      >
        OHL
      </option>
      <option
        value="SHL"
      >
        SHL
      </option>
    </select>
  `)
})

it('fires handleChange on selecting an option', () => {
  const label = 'League:'
  const options = ['Any', 'OHL', 'SHL']
  const selectedOption = options[0]
  const handleChange = jest.fn()
  render(<Filter name="leagues" label={label} options={options} handleChange={handleChange} />)

  const input = screen.getByLabelText(label)
  fireEvent.change(input, { target: { value: selectedOption, name: selectedOption } })

  expect(handleChange).toHaveBeenCalledTimes(1)
  expect(input.value).toBe(selectedOption)
})

it('is an accessible form', async () => {
  const label = 'League:'
  const options = ['Any', 'OHL', 'SHL']
  const { container } = render(<Filter name="leagues" label={label} options={options} />)
  const results = await axe(container)

  expect(results).toHaveNoViolations()
})
