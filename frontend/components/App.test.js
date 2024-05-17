import React from 'react'
import { render, fireEvent, screen } from '@testing-library/react'
import '@testing-library/jest-dom/extend-expect'
import AppFunctional from './AppFunctional'


test('AppFunctional renders headings, buttons, and links correctly', () => {
  render(<AppFunctional />)

  // Test heading texts
  expect(screen.getByText('Coordinates (2, 2)')).toBeInTheDocument()
  expect(screen.getByText('You moved 0 times')).toBeInTheDocument()

  // Test button texts
  expect(screen.getByText('LEFT')).toBeInTheDocument()
  expect(screen.getByText('UP')).toBeInTheDocument()
  expect(screen.getByText('RIGHT')).toBeInTheDocument()
  expect(screen.getByText('DOWN')).toBeInTheDocument()
  expect(screen.getByText('reset')).toBeInTheDocument()

  // Check if buttons are visible
  expect(screen.getByRole('button', { name: 'LEFT' })).toBeVisible()
  expect(screen.getByRole('button', { name: 'UP' })).toBeVisible()
  expect(screen.getByRole('button', { name: 'RIGHT' })).toBeVisible()
  expect(screen.getByRole('button', { name: 'DOWN' })).toBeVisible()
  expect(screen.getByRole('button', { name: 'reset' })).toBeVisible()
})

test('Typing in the email input changes its value', () => {
  render(<AppFunctional />)

  const emailInput = screen.getByPlaceholderText('type email')

  // Type in the email input
  fireEvent.change(emailInput, { target: { value: 'example@example.com' } })

  // Check if the value of the input has changed
  expect(emailInput).toHaveValue('example@example.com')
})
