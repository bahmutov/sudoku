import React from 'react'
import { App } from './App'
import { mount } from 'cypress-react-unit-test'

describe('App', () => {
  it('looks good', () => {
    mount(<App />)
  })
})
