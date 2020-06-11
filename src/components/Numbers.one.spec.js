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
    );
    // trying to assert every number in the DOM
    [1, 2, 3, 4, 5, 6, 7, 8, 9].forEach(k => {
      cy.contains('.status__number', k)
    })
  })
})
