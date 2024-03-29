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
    const user2 = {
      name: 'Second User',
      username: 'seconduser',
      password: 'password2'
    }
    cy.request('POST', `${Cypress.env('BACKEND')}/users`, user)
    cy.request('POST', `${Cypress.env('BACKEND')}/users`, user2)
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
    it('Only creator can delete a blog', function () {
      cy.contains('Add New Blog').click()
      cy.get('#title').type('Tepon eka blogi')
      cy.get('#author').type('Teppo Testaaja')
      cy.get('#url').type('www.testiblogi.fi')
      cy.get('#create-button').click()
      cy.contains('Tepon eka blogi')
      cy.contains('logout').click()
      cy.wait(1000) // 1s

      cy.get('#username').type('seconduser')
      cy.get('#password').type('password2')
      cy.get('#login-button').click()
      cy.contains('Tepon eka blogi').parent().as('blogRow')
      cy.get('@blogRow').contains('view').click()
      cy.get('@blogRow').should('not.contain', 'Delete')
    })
    it('Blogs are sorted by likes', function () {
      cy.contains('logout').click()
      cy.wait(1000) // 1s
      cy.get('#username').type('Ttestaaja')
      cy.get('#password').type('salainen')
      cy.get('#login-button').click()
      const blogs = [
        { title: 'First Blog', author: 'Author 1', url: 'http://first.blog' },
        { title: 'Second Blog', author: 'Author 2', url: 'http://second.blog' },
        { title: 'Third Blog', author: 'Author 3', url: 'http://third.blog' },
      ]
      blogs.forEach((blog) => {
        cy.contains('Add New Blog').click()
        cy.get('#title').type(blog.title)
        cy.get('#author').type(blog.author)
        cy.get('#url').type(blog.url)
        cy.get('#create-button').click()
        cy.contains(blog.title)
      })

      cy.get('.blog').then((blogList) => {
        // Like the first blog once
        cy.wrap(blogList[0]).contains('view').click()
        cy.wrap(blogList[0]).contains('like').click()
        cy.wrap(blogList[0]).contains('likes 1')

        // Like the second blog twice
        cy.wrap(blogList[1]).contains('view').click()
        cy.wrap(blogList[1]).contains('like').click()
        cy.wrap(blogList[1]).contains('likes 1')
        cy.wrap(blogList[1]).contains('like').click()
        cy.wrap(blogList[1]).contains('likes 2')
        // Like the third blog thrice
        cy.wrap(blogList[2]).contains('view').click()
        cy.wrap(blogList[2]).contains('like').click()
        cy.wrap(blogList[2]).contains('likes 1')
        cy.wrap(blogList[2]).contains('like').click()
        cy.wrap(blogList[2]).contains('likes 2')
        cy.wrap(blogList[2]).contains('like').click()
        cy.wrap(blogList[2]).contains('likes 3')
      })

      // Check the order of blogs
      cy.get('.blog').then((blogList) => {
        cy.wrap(blogList[0]).should('contain', 'Third Blog')
        cy.wrap(blogList[1]).should('contain', 'Second Blog')
        cy.wrap(blogList[2]).should('contain', 'First Blog')
      })
    })
  })
})