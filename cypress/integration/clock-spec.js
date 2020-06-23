/// <reference types="cypress" />
if (Cypress.browser.isHeaded) {
  describe('Mocking clock', () => {
    it('restores', () => {
      cy.clock(+ new Date())
      cy.visit('http://localhost:3000/sudoku')
      // make sure the application has rendered
      // and the synthetic clock started working
      cy.get('.game__cell--filled').should('have.length', 45)

      cy.tick(600 * 1000) // 10 minutes
      cy.contains('.status__time', '10:00')

      // resume the clock
      cy.tick().then(clock => {
        clock.restore()
      })
      // the clock is restored to original value
      // thus the timer will start measuring again
      // from the original date passed to "cy.clock"
      cy.contains('.status__time', '00:03')
    })
  })
}
