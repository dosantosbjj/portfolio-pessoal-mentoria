# Fighters API

Uma API para gerenciamento de lutadores e usuários administradores, com autenticação JWT e documentação Swagger.

## Funcionalidades

- Autenticação de usuários com JWT
- Cadastro de novos usuários administradores
- CRUD de lutadores
- Busca de lutadores por nome ou categoria de peso
- Documentação Swagger
- Persistência em localStorage

## Instalação

1. Clone o repositório
2. Instale as dependências:
```bash
npm install
```

## Executando o projeto

Para desenvolvimento (com hot-reload):
```bash
npm run dev
```

Para produção:
```bash
npm start
```

## Documentação da API

A documentação Swagger está disponível em:
```
http://localhost:3000/api-docs
```

## Usuário Administrador Padrão

```
Email: admin@admin.com
Senha: admin123
```

## Endpoints

### Usuários
- POST /api/users/register - Cadastro de novo usuário
- POST /api/users/login - Login de usuário

### Lutadores
- GET /api/fighters - Lista todos os lutadores
- GET /api/fighters/search - Busca lutadores por nome ou categoria
- POST /api/fighters - Cadastra novo lutador
- PUT /api/fighters/:id - Atualiza um lutador
- DELETE /api/fighters/:id - Remove um lutador

## Autenticação

A API utiliza autenticação JWT. Para acessar endpoints protegidos, inclua o token no header:
```
Authorization: Bearer seu-token-aqui
```