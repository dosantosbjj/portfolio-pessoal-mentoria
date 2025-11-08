const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { JWT_SECRET, authMiddleware } = require('../middleware/auth');
const storage = require('../models/localStorage');

const router = express.Router();

/**
 * @swagger
 * /api/users/register:
 *   post:
 *     tags:
 *       - Users
 *     summary: Register a new user
 *     description: Create a new admin user
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *               email:
 *                 type: string
 *               password:
 *                 type: string
 *                 minLength: 8
 *               cpf:
 *                 type: string
 *     responses:
 *       201:
 *         description: User created successfully
 *       400:
 *         description: Invalid input data
 */
router.post('/register', async (req, res) => {
  try {
    const { name, email, password, cpf } = req.body;

    if (!name || !email || !password || !cpf) {
      return res.status(400).json({ message: 'Todos os campos são obrigatórios' });
    }

    if (password.length < 8) {
      return res.status(400).json({ message: 'A senha deve ter no mínimo 8 caracteres' });
    }

    if (storage.findUserByEmail(email)) {
      return res.status(400).json({ message: 'Email já cadastrado' });
    }

    if (storage.findUserByCpf(cpf)) {
      return res.status(400).json({ message: 'CPF já cadastrado' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = {
      id: storage.getUsers().length + 1,
      name,
      email,
      password: hashedPassword,
      cpf
    };

    storage.addUser(newUser);
    res.status(201).json({ message: 'User created successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error creating user' });
  }
});

/**
 * @swagger
 * /api/users/login:
 *   post:
 *     tags:
 *       - Users
 *     summary: Login user
 *     description: Authenticate a user and return a JWT token
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *               password:
 *                 type: string
 *     responses:
 *       200:
 *         description: Login successful
 *       401:
 *         description: Invalid credentials
 */
router.post('/login', async (req, res) => {
  try {
    console.log('Login attempt with body:', req.body);
    const { email, password } = req.body;
    
    if (!email || !password) {
      console.log('Missing email or password');
      return res.status(400).json({ message: 'Email and password are required' });
    }

    console.log('Looking for user:', email);
    const user = storage.findUserByEmail(email);
    console.log('Found user:', user ? 'yes' : 'no');

    if (!user) {
      console.log('User not found:', email);
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    console.log('User found, validating password');
    try {
      const validPassword = await bcrypt.compare(password, user.password);
      console.log('Password validation result:', validPassword);
      
      if (!validPassword) {
        console.log('Invalid password for user:', email);
        return res.status(401).json({ message: 'Invalid credentials' });
      }
    } catch (bcryptError) {
      console.error('bcrypt error:', bcryptError);
      return res.status(500).json({ message: 'Error validating credentials' });
    }

    try {
      const token = jwt.sign({ id: user.id }, JWT_SECRET, {
        expiresIn: '1d'
      });

      const { password: _, ...userData } = user;
      return res.json({ token, user: userData });
    } catch (jwtError) {
      console.error('Erro JWT:', jwtError);
      return res.status(500).json({ message: 'Erro na geração do token' });
    }
  } catch (error) {
    console.error('Erro inesperado durante o login:', error);
    res.status(500).json({ message: 'Falha no login', details: error.message });
  }
});

/**
 * @swagger
 * /api/users:
 *   get:
 *     tags:
 *       - Users
 *     summary: List all users
 *     description: Retrieve a list of all admin users (requires authentication)
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of users
 *       401:
 *         description: Unauthorized
 */
router.get('/', authMiddleware, (req, res) => {
  const users = storage.getUsers().map(({ password, ...user }) => user);
  res.status(200).json(users);
});

/**
 * @swagger
 * /api/users/search:
 *   get:
 *     tags:
 *       - Users
 *     summary: Search users
 *     description: Search users by email or CPF (requires authentication)
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: email
 *         schema:
 *           type: string
 *         description: Email to search for
 *       - in: query
 *         name: cpf
 *         schema:
 *           type: string
 *         description: CPF to search for
 *     responses:
 *       200:
 *         description: User found
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: User not found
 */
router.get('/search', authMiddleware, (req, res) => {
  const { email, cpf } = req.query;
  let user = null;

  if (email) {
    user = storage.findUserByEmail(email);
  } else if (cpf) {
    user = storage.findUserByCpf(cpf);
  } else {
    return res.status(400).json({ message: 'Favor preencher email ou CPF' });
  }

  if (!user) {
    return res.status(404).json({ message: 'Usuário não encontrado' });
  }

  const { password, ...userData } = user;
  res.status(200).json(userData);
});

/**
 * @swagger
 * /api/users/{id}:
 *   put:
 *     tags:
 *       - Users
 *     summary: Update a user
 *     description: Update user information (requires authentication)
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: User ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *               email:
 *                 type: string
 *               password:
 *                 type: string
 *                 minLength: 8
 *               cpf:
 *                 type: string
 *     responses:
 *       200:
 *         description: User updated successfully
 *       400:
 *         description: Invalid input data
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: User not found
 */
router.put('/:id', authMiddleware, async (req, res) => {
  try {
    const id = parseInt(req.params.id);
    const { name, email, password, cpf } = req.body;
    const users = storage.getUsers();
    const userIndex = users.findIndex(u => u.id === id);

    if (userIndex === -1) {
      return res.status(404).json({ message: 'Usuário não encontrado' });
    }

    // Check if email is being changed and is already in use
    if (email && email !== users[userIndex].email && storage.findUserByEmail(email)) {
      return res.status(400).json({ message: 'Email informado é inválido ou já está cadastrado' });
    }

    // Check if CPF is being changed and is already in use
    if (cpf && cpf !== users[userIndex].cpf && storage.findUserByCpf(cpf)) {
      return res.status(400).json({ message: 'CPF informado é inválido ou já está cadastrado' });
    }

    // Update user data
    const updatedUser = {
      ...users[userIndex],
      name: name || users[userIndex].name,
      email: email || users[userIndex].email,
      cpf: cpf || users[userIndex].cpf
    };

    // Update password if provided
    if (password) {
      if (password.length < 8) {
        return res.status(400).json({ message: 'Senha deve possuir no mínimo 8 caracteres' });
      }
      updatedUser.password = await bcrypt.hash(password, 10);
    }

    users[userIndex] = updatedUser;
    storage.saveUsers(users);

    const { password: _, ...userData } = updatedUser;
    res.json(userData);
  } catch (error) {
    res.status(500).json({ message: 'Falha na atualização do usuário, tente novamente mais tarde' });
  }
});

/**
 * @swagger
 * /api/users/{id}:
 *   delete:
 *     tags:
 *       - Users
 *     summary: Delete a user
 *     description: Remove a user from the system (requires authentication)
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: User ID
 *     responses:
 *       200:
 *         description: User deleted successfully
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: User not found
 */
router.delete('/:id', authMiddleware, (req, res) => {
  const id = parseInt(req.params.id);
  const users = storage.getUsers();
  const userIndex = users.findIndex(u => u.id === id);

  if (userIndex === -1) {
    return res.status(404).json({ message: 'User not found' });
  }

  // Prevent deleting the last admin user
  if (users.length === 1) {
    return res.status(400).json({ message: 'Cannot delete the last admin user' });
  }

  users.splice(userIndex, 1);
  storage.saveUsers(users);

  return res.status(204).json({ message: 'User deleted successfully' });
});

module.exports = router;