/// <reference types="cypress" />
import React from 'react'
import { App } from './App'
import { mount } from 'cypress-react-unit-test'
import { getSudoku } from './solver/sudoku'
import * as UniqueSudoku from './solver/UniqueSudoku'
import initArray from '../cypress/fixtures/init-array.json'
import solvedArray from '../cypress/fixtures/solved-array.json'

describe('App', () => {
  // let initArray
  // let solvedArray
  // before(() => {
  //   cy.fixture('init-array').then(arr => initArray = arr)
  //   cy.fixture('solved-array').then(arr => solvedArray = arr)
  // })

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
    cy.contains('.status__time', '00:00')
      .matchImageSnapshot('timer-zero')
    cy.tick(700 * 1000)
    cy.contains('.status__time', '11:40')
      .matchImageSnapshot('timer-passed')
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

  it('mocks board creation', () => {
    cy.fixture('init-array').then(initArray => {
      cy.fixture('solved-array').then(solvedArray => {
        cy.stub(UniqueSudoku, 'getUniqueSudoku').returns([initArray, solvedArray])
      })
    })
    cy.clock()
    mount(<App />)
    cy.get('.game__cell--filled').should('have.length', 45)
    cy.get('.container').matchImageSnapshot('same-game-mocked-sudoku')
  })

  it('plays one move', () => {
    cy.stub(UniqueSudoku, 'getUniqueSudoku').returns([initArray, solvedArray])
    cy.clock()
    mount(<App />)
    cy.get('.game__cell').first().click()
    cy.contains('.status__number', '6').click()
    cy.get('.game__cell').first()
      .should('have.class', 'game__cell--highlightselected')
    cy.get('.container').matchImageSnapshot('same-game-made-one-move')
  })

  it('takes demo screenshot', () => {
    cy.viewport(1000, 800)
    cy.stub(UniqueSudoku, 'getUniqueSudoku').returns([initArray, solvedArray])
    cy.clock()
    mount(<App />)
    cy.get('.game__cell').first().click()
    cy.contains('.status__number', '6').click()
    cy.get('.game__cell').first()
      .should('have.class', 'game__cell--highlightselected')
    cy.screenshot('played-a-move', {capture: 'viewport'})
  })

  it('plays to win', () => {
    // start with all but the first cell filled with solved array
    const almostSolved = [...solvedArray]
    // by setting entry to "0" we effectively clear the cell
    almostSolved[0] = '0'
    cy.stub(UniqueSudoku, 'getUniqueSudoku').returns([almostSolved, solvedArray])
      .as('getUniqueSudoku')
    cy.clock()
    mount(<App />)
    cy.get('.game__cell').first().click()
    // we can even look at the solved array!
    cy.contains('.status__number', solvedArray[0]).click()
    // winning message displayed
    cy.get('.overlay__text').should('be.visible')
    cy.get('.container').matchImageSnapshot('game-solved')

    // clicking the overlay starts the new game
    cy.get('@getUniqueSudoku').should('have.been.calledOnce')
    cy.get('.overlay__text').click()
    cy.get('.overlay').should('not.be.visible')
    cy.get('@getUniqueSudoku').should('have.been.calledTwice')
  })

  it('restores the clock', () => {
    // mock the clock with current timestamp
    // so that when we restore it the elapsed time
    // makes sense
    cy.clock(+ new Date())
    mount(<App />)
    // make sure the application has rendered
    // and the synthetic clock started working
    cy.get('.game__cell--filled').should('have.length', 45)

    cy.tick(600 * 1000) // 10 minutes
    cy.contains('.status__time', '10:00')

    // resume the clock
    // cy.tick().then(clock => {
    //   clock.restore()
    // })

    // shortcut way to call "clock.restore("
    cy.tick().invoke('restore')

    // the clock is restored to original value
    // thus the timer will start measuring again
    // from the original date passed to "cy.clock"
    cy.contains('.status__time', '00:03')
  })
})
