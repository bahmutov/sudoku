import rewiremock from 'rewiremock'
import { addMatchImageSnapshotCommand } from 'cypress-image-snapshot/command';
if (Cypress.config('isInteractive')) {
  Cypress.Commands.add('matchImageSnapshot', () => {
    cy.log('Skipping snapshot 👀')
  })
} else {
  addMatchImageSnapshotCommand()
}
require('cypress-react-unit-test/support')

rewiremock.overrideEntryPoint(module)

beforeEach(() => {
  rewiremock.enable()
})

afterEach(() => {
  rewiremock.disable()
})
