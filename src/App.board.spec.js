/// <reference types="cypress" />
import React from 'react'
import { App } from './App'
import { mount } from 'cypress-react-unit-test'
import * as UniqueSudoku from './solver/UniqueSudoku'
import initArray from '../cypress/fixtures/init-array.json'
import solvedArray from '../cypress/fixtures/solved-array.json'

describe('App', () => {
  it('mocks board creation', () => {
    cy.stub(UniqueSudoku, 'getUniqueSudoku').returns([initArray, solvedArray])
    cy.clock()
    mount(<App />)
    cy.get('.game__cell--filled').should('have.length', 45)
    // let's make sure the board has rendered numbers
    expect(initArray[2]).to.not.equal('0')
    cy.get('.game__cell').eq(2).should('have.text', initArray[2])
    cy.get('.container').matchImageSnapshot('same-game-mocked-sudoku')
  })

  it('plays first move', () => {
    cy.stub(UniqueSudoku, 'getUniqueSudoku').returns([initArray, solvedArray])
    cy.clock()
    mount(<App />)
    cy.get('.game__cell').first().click()
    cy.get('.game__cell').first().should('have.class', 'game__cell--highlightselected')
    cy.contains('.status__number', 6).click()
    cy.get('.game__cell').first().should('have.text', '6')
    cy.get('.container').matchImageSnapshot('first-move')
  })

  it('looks right in different resolutions', () => {
    cy.stub(UniqueSudoku, 'getUniqueSudoku').returns([initArray, solvedArray])
    cy.clock()
    mount(<App />)
    cy.viewport(500, 700)
      .wait(100)
    cy.get('.container').matchImageSnapshot('tablet')
    cy.viewport(300, 700)
      .wait(100)
    cy.get('.container').matchImageSnapshot('mobile')
  })
})
