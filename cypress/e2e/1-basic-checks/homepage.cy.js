/// <reference types="cypress" />

describe('homepage', () => {
  beforeEach(() => {
    cy.visit('http://localhost:3000')
  })

  it('displays two todo items by default', () => {
    cy.get('h1').contains('trips').should('exist');
  })
})
