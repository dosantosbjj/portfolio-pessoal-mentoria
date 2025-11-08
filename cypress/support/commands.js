Cypress.Commands.add('userRegister', (user) => {
    cy.get('[data-testid="name-input"]').type(user.name)
    cy.get('[data-testid="email-input"]').type(user.email)
    cy.get('[data-testid="password-input"]').type(user.password, {log:false})
    cy.get('[data-testid="cpf-input"]').type(user.cpf, {log:false})
})

Cypress.Commands.add('login', (email, password) => {
    cy.get('[data-testid="email-input"]').type(email);
    cy.get('[data-testid="password-input"]').type(password, {log: false});
})