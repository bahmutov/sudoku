/// <reference types="cypress" />
import React from 'react'
import { mount } from 'cypress-react-unit-test'
import { Numbers } from './Numbers'
import '../App.css'
import {SudokuContext} from '../context/SudokuContext'

describe('Numbers', () => {
  it('shows all numbers', () => {
    mount(
      <div className="innercontainer">
        <section className="status">
          <Numbers />
        </section>
      </div>
    )
  })

  it('reacts to a click', () => {
    mount(
      <div className="innercontainer">
        <section className="status">
          <Numbers onClickNumber={cy.stub().as('click')}/>
        </section>
      </div>
    )
    cy.contains('.status__number', '9').click()
    cy.get('@click').should('have.been.calledWith', '9')
  })

  it('shows selected number', () => {
    mount(
      <SudokuContext.Provider value={{ numberSelected: '4' }} >
        <div className="innercontainer">
          <section className="status">
            <Numbers />
          </section>
        </div>
      </SudokuContext.Provider>
    )
    cy.contains('.status__number', '4').should('have.class', 'status__number--selected')
    cy.get('.status__numbers').matchImageSnapshot('numbers-selected')
  })
})
