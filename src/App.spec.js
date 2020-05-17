import React from 'react'
import { App } from './App'
import { mount } from 'cypress-react-unit-test'

describe('App', () => {
  it('looks good', () => {
    mount(<App />)
    cy.get('.status__numbers').matchImageSnapshot('numbers')

    cy.get('.status__action-fast-mode').click()
    cy.contains('.status__number', '4')
      .click()
      .should('have.class', 'status__number--selected')

    cy.get('.status__numbers').matchImageSnapshot('numbers-selected')
  })
})
