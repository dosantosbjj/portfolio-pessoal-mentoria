import { faker } from "@faker-js/faker";

///<reference types="Cypress" />

describe("User tests", () => {
  beforeEach(() => {
    cy.visit("/");
  });

  context("Users list and delete", () => {
    beforeEach(() => {
      cy.login(Cypress.env("ADMIN"), Cypress.env("PASSWORD"));
      cy.intercept("POST", `${Cypress.env("API_HOST")}/users/login`).as(
        "postLogin"
      );
      cy.get('[data-testid="login-button"]').click();
      cy.wait("@postLogin");
    });

    it("Should list the registered users", () => {
      cy.intercept("GET", `${Cypress.env("API_HOST")}/users`).as("getUsers");
      cy.contains("Usuários").click();
      cy.wait("@getUsers");
      cy.get("th").contains("Nome").should("be.visible");
      cy.get("th").contains("Email").should("be.visible");
      cy.get("th").contains("CPF").should("be.visible");
      cy.get("th").contains("Ações").should("be.visible");
    });

    it("Should not be possible to delete the admin user", () => {
      cy.intercept("GET", `${Cypress.env("API_HOST")}/users`).as("getUsers");
      cy.contains("Usuários").click();
      cy.wait("@getUsers");
      cy.get("tr")
        .contains("Admin")
        .then((element) => {
          cy.get('[data-testid="delete-user-1"]').should("not.exist");
        });
    });

    it.only("User should be deleted successfully", () => {
      cy.intercept("GET", `${Cypress.env("API_HOST")}/users`).as("getUsers");
      cy.contains("Usuários").click();
      cy.wait("@getUsers");
      cy.intercept("DELETE", `${Cypress.env("API_HOST")}/users/*`).as(
        "deleteUser"
      );
      cy.get("tr").eq(2).find("button").click();
      cy.get("button").contains("Excluir").click();
      cy.wait("@deleteUser");
      cy.contains("Usuário excluído com sucesso");
    });
  });

  context("User register", () => {
    beforeEach(() => {
      cy.contains("Cadastre-se").click();
      cy.url().should("contain", "register");
    });
    it("User registers successfully", () => {
      const user = {
        name: faker.person.firstName(),
        email: faker.internet.email(),
        password: faker.internet.password(),
        cpf: faker.number.int(100000000000),
      };

      cy.userRegister(user);
      cy.intercept("POST", `${Cypress.env("API_HOST")}/users/register`).as(
        "registerUser"
      );
      cy.get('[data-testid="register-button"]').click();
      cy.wait("@registerUser");
      cy.contains(
        "Cadastro realizado com sucesso. Por favor, faça login."
      ).should("be.visible");
    });

    it("User registration fails - mandatory fields empty", () => {
      cy.get('[data-testid="register-button"]').click();
      cy.contains("Todos os campos são obrigatórios").should("be.visible");
    });

    it("User registration fails - short password", () => {
      const user = {
        name: faker.person.firstName(),
        email: faker.internet.email(),
        password: "short",
        cpf: faker.number.int(100000000000),
      };

      cy.userRegister(user);
      cy.intercept("POST", `${Cypress.env("API_HOST")}/users/register`).as(
        "registerUser"
      );
      cy.get('[data-testid="register-button"]').click();
      cy.wait("@registerUser").its("response.statusCode").should("eq", 400);
      cy.contains("A senha deve ter no mínimo 8 caracteres").should(
        "be.visible"
      );
    });

    it("User registers successfully and log in", () => {
      const user = {
        name: faker.person.firstName(),
        email: faker.internet.email(),
        password: faker.internet.password(),
        cpf: faker.number.int(100000000000),
      };

      cy.userRegister(user);
      cy.intercept("POST", `${Cypress.env("API_HOST")}/users/register`).as(
        "registerUser"
      );
      cy.get('[data-testid="register-button"]').click();
      cy.wait("@registerUser");
      cy.contains(
        "Cadastro realizado com sucesso. Por favor, faça login."
      ).should("be.visible");
      cy.url().should("contain", "login");

      cy.wait(2000);
      cy.login(user.email, user.password);
      cy.intercept("POST", `${Cypress.env("API_HOST")}/users/login`).as(
        "postLogin"
      );
      cy.get('[data-testid="login-button"]').click();
      cy.wait("@postLogin");
      // cy.contains("Bem-vindo").should("be.visible");
    });
  });
});
