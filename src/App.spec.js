/// <reference types="cypress" />
import React from 'react'
import { App } from './App'
import { mount } from 'cypress-react-unit-test'

describe('App', () => {
  it('looks good', () => {
    mount(<App />)

    cy.log('**game sections**')
    // ensure the board has rendered
    cy.get('.game__board').should('be.visible').wait(1000)
    cy.get('.header').matchImageSnapshot('header')
    cy.get('.status__difficulty').matchImageSnapshot('difficulty')
    cy.get('.status__actions').matchImageSnapshot('actions')

    cy.log('**numbers**')
    cy.get('.status__numbers').matchImageSnapshot('numbers')

    cy.get('.status__action-fast-mode').click()

    cy.contains('.status__number', '5').click()
      .should('have.class', 'status__number--selected')
    cy.get('.status__numbers').matchImageSnapshot('numbers-selected')
  })

  it('shows the timer', () => {
    cy.clock()
    mount(<App />)
    cy.get('.status__time').matchImageSnapshot('timer-zero')
    cy.tick(700 * 1000)
    cy.get('.status__time').matchImageSnapshot('timer-passed')
  })

  it('checks the entire game', () => {
    cy.clock()
    mount(<App />)
    cy.get('.game__cell').each($cell => $cell.css('opacity', '0'))
    cy.get('.container').matchImageSnapshot('game-container')
  })
})
