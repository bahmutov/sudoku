/// <reference types="cypress" />
import React from 'react'
import { mount } from 'cypress-react-unit-test'
import { Numbers } from './Numbers'
import '../App.css'
import {SudokuContext} from '../context/SudokuContext'

describe('Numbers', () => {
  it('shows numbers', () => {
    mount(
      <div className="innercontainer">
        <section className="status">
          <Numbers />
        </section>
      </div>
    )
  })

  it('shows all numbers', () => {
    mount(
      <div className="innercontainer">
        <section className="status">
          <Numbers />
        </section>
      </div>
    );
    // trying to assert every number in the DOM one by one
    // [1, 2, 3, 4, 5, 6, 7, 8, 9].forEach(k => {
    //   cy.contains('.status__number', k)
    // })
    // or use a single image snapshot after making sure
    // the component has been rendered into the DOM
    cy.get('.status__number').should('have.length', 9)
    cy.get('.status__numbers').matchImageSnapshot('all-numbers')
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
