/// <reference types="cypress" />
import rewiremock from 'rewiremock/webpack'
import React from 'react'
import { App } from './App'
import { mount } from 'cypress-react-unit-test'
import { getSudoku } from './solver/sudoku'
import { getUniqueSudoku } from './solver/UniqueSudoku';
// rewiremock('./solver/UniqueSudoku.js')
//   .with({
//     getUniqueSudoku: () => {
//       throw new Error('here')
//     }
//   })

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
    cy.get('.game__cell--filled').should('have.length', 45)
    cy.get('.game__cell').each($cell => $cell.css('opacity', '0'))
    cy.get('.container').matchImageSnapshot('game-container')
  })

  it('shows deterministic board', () => {
    const str = '713.94528294851637568...914871935246425186379936472185.8..4.7...57..849..4....8..'
    const sudoku = getSudoku()
    cy.stub(sudoku, 'generate').returns(str)
    cy.stub(Math, 'random').returns(0.5)

    cy.clock()
    mount(<App />)
    cy.get('.game__cell--filled').should('have.length', 45)
    cy.get('.container').matchImageSnapshot('same-game-container')

    cy.viewport('iphone-6')
    cy.get('.container').matchImageSnapshot('same-game-container-iphone6')

    cy.viewport(250, 400)
    cy.get('.container').matchImageSnapshot('same-game-container-250px')
  })

  it('plays a move', () => {
    const str = '713.94528294851637568...914871935246425186379936472185.8..4.7...57..849..4....8..'
    const sudoku = getSudoku()
    cy.stub(sudoku, 'generate').returns(str)
    cy.stub(Math, 'random').returns(0.5)

    cy.clock()
    mount(<App />)
    cy.get('.game__cell').first().click()
    cy.contains('.status__number', '7').click()
    cy.get('.game__cell').first().should('have.class', 'game__cell--highlightselected')
    cy.get('.container').matchImageSnapshot('same-game-container-move')
  })

  it.only('mocks import', () => {
    // debugger
    rewiremock('./solver/UniqueSudoku.js')
      .with({})

    console.log(getUniqueSudoku)
    mount(<App />)
  })
})
