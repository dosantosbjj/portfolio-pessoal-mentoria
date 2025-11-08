describe("Login tests", () => {
  beforeEach(() => {
    cy.visit("/");
  });

  it("Should visit login page", () => {
    cy.url().should("contain", "login");
  });

  it("Successful login", () => {
    cy.login(Cypress.env('ADMIN'), Cypress.env('PASSWORD'))
    cy.intercept('POST',`${Cypress.env('API_HOST')}/users/login`).as('postLogin')
    cy.get('[data-testid="login-button"]').click();
    cy.wait('@postLogin')
    cy.contains('Bem-vindo').should('be.visible')
  
  });

  it("Login failure - empty fields", () => {
    cy.get('[data-testid="login-button"]').click();
    cy.get('[data-status="error"]').should("be.visible");
    cy.contains("Por favor, preencha todos os campos").should("be.visible");
  });
});
