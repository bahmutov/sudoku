/// <reference types="cypress" />
import React from 'react'
import { mount } from 'cypress-react-unit-test'
import { Numbers } from './Numbers'
import '../App.css'
import {SudokuContext} from '../context/SudokuContext'
describe('Numbers', () => {
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
  })
})
