import '../support/commands'

describe('Blog', function () {
  beforeEach(function () {
    cy.request({
      method: 'POST',
      url: `${Cypress.env('BACKEND')}/testing/reset`,
      failOnStatusCode: false
    }).then((response) => {
      console.log(response)
    })

    const user = {
      name: 'Teppo Testaaja',
      username: 'Ttestaaja',
      password: 'salainen',
    }
    cy.request('POST', `${Cypress.env('BACKEND')}/users`, user)
    cy.visit('')
  })

  it('front page can be opened', function () {
    cy.visit('')
    cy.contains('Log in')
  })

  it('user can login', function () {
    cy.get('#username').type('Ttestaaja')
    cy.get('#password').type('salainen')
    cy.get('#login-button').click()

    cy.contains('Teppo Testaaja logged in')
  })

  it('login fails with wrong password', function () {
    cy.get('#username').type('Ttestaaja')
    cy.get('#password').type('wrong')
    cy.get('#login-button').click()

    cy.contains('Wrong username/password')
  })
  describe('When logged in', function () {
    beforeEach(function () {
      cy.get('#username').type('Ttestaaja')
      cy.get('#password').type('salainen')
      cy.get('#login-button').click()
    })

    it('A blog can be created', function () {
      cy.contains('Add New Blog').click()
      cy.get('#title').type('Tepon Testiblogi')
      cy.get('#author').type('Teppo Testaaja')
      cy.get('#url').type('www.testiblogi.fi')
      cy.get('#create-button').click()
      cy.contains('Tepon Testiblogi')
    })

    it('A blog can be liked', function () {
      cy.contains('Add New Blog').click()
      cy.get('#title').type('Tepon Testiblogi')
      cy.get('#author').type('Teppo Testaaja')
      cy.get('#url').type('www.testiblogi.fi')
      cy.get('#create-button').click()
      cy.contains('Tepon Testiblogi')
      cy.contains('view').click()
      cy.get('#like-button').click()
      cy.contains('likes 1')
    })
    it('A blog can be created and deleted', function() {
      cy.contains('Add New Blog').click()
      cy.get('#title').type('Blog to be deleted')
      cy.get('#author').type('Author to be deleted')
      cy.get('#url').type('http://to-be-deleted.com')
      cy.get('#create-button').click()
      cy.contains('Blog to be deleted')
      cy.contains('view').click()
      cy.get('#delete-button').click()
      cy.wait(1000) // 1s
      cy.on('window:confirm', () => true)
      cy.contains('Blog to be deleted').should('not.exist')
    })
  })
})