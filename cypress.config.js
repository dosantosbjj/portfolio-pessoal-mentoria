const { defineConfig } = require("cypress");

module.exports = defineConfig({
  e2e: {
    baseUrl: 'http://localhost:4001',
    env: {
      API_HOST : 'http://localhost:3000/api',
      ADMIN: 'admin@test.com',
      PASSWORD: 'password123'
    },
    setupNodeEvents(on, config) {
    },
  },
});
