// ***********************************************
// This example commands.js shows you how to
// create various custom commands and overwrite
// existing commands.
//
// For more comprehensive examples of custom
// commands please read more here:
// https://on.cypress.io/custom-commands
// ***********************************************
//
//
// -- This is a parent command --
// Cypress.Commands.add("login", (email, password) => { ... })
//
//
// -- This is a child command --
// Cypress.Commands.add("drag", { prevSubject: 'element'}, (subject, options) => { ... })
//
//
// -- This is a dual command --
// Cypress.Commands.add("dismiss", { prevSubject: 'optional'}, (subject, options) => { ... })
//
//
// -- This will overwrite an existing command --
// Cypress.Commands.overwrite("visit", (originalFn, url, options) => { ... })
Cypress.Commands.add('getByTestId', (selector) => {
  return cy.get(`[data-testid="${selector}"]`)
})

Cypress.Commands.add('addToCart', (mode) => {
  cy.getByTestId('product-card').as('productCards')

  const click = (index) =>
    cy.get('@productCards').eq(index).find('button').click({ force: true })

  const addByIndex = () => {
    click(mode.index)
  }

  const addByIndexes = () => {
    for (const index of mode.indexes) {
      click(index)
    }
  }

  const addAll = () => {
    cy.get('@productCards').then(($elements) => {
      for (let i = 0; i < $elements.length; i++) {
        click(i)
      }
    })
  }

  if (!!mode.indexes && Array.isArray(mode.indexes)) {
    addByIndexes()
  } else if (mode.index) {
    addByIndex()
  } else if (!!mode.indexes && mode.indexes === 'all') {
    addAll()
  } else {
    throw new Error('Please provide a valid input for cy.addToCart()\r')
  }
})
