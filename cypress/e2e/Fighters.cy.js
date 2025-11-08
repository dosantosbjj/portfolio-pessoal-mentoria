/// <reference types="cypress" />

import { faker } from '@faker-js/faker'

describe("Fighter tests", {testIsolation:false}, () => {
  before(() => {
    cy.visit('/')
    cy.login(Cypress.env("ADMIN"), Cypress.env("PASSWORD"))
      cy.intercept("POST", `${Cypress.env("API_HOST")}/users/login`).as("postLogin"
      )
      cy.get('[data-testid="login-button"]').click()
      cy.wait("@postLogin")
  })

  it("Should list registered fighters", () => {
    cy.contains('Lutadores MFC').should('be.visible')
    cy.contains('Adicionar Lutador').should('be.visible')
  })

  it("Should register a fighter successfully", () => {
    cy.contains('Adicionar Lutador').click()
    cy.contains('Adicionar Novo Lutador').should('be.visible')
    cy.get('input[name="name"]').type(faker.person.fullName())
    cy.get('select[name="weightClass"]').select('Peso Pena')
    cy.get('input[name="nationality"]').type(faker.location.country())
    cy.get('input[name="specialty"]').type(faker.music.songName())
    cy.get('input[name="record"]').type('0-0-0')
    cy.intercept('POST', `${Cypress.env('API_HOST')}/fighters`).as('postFighter')
    cy.get('button[type="submit"]').click()
    cy.wait('@postFighter')
    cy.contains('Lutador adicionado com sucesso').should('be.visible')
  })

  it('Should list a fighter details', () => {
    cy.get('.chakra-card').first().find('button').click()
    cy.contains('Categoria').should('be.visible')
    cy.contains('Nacionalidade').should('be.visible')
    cy.contains('Especialidade').should('be.visible')
    cy.contains('Cartel').should('be.visible')
  })
})
