const express = require('express');
const cors = require('cors');
const swaggerUi = require('swagger-ui-express');
const swaggerJsdoc = require('swagger-jsdoc');
const userRoutes = require('./routes/userRoutes');
const fighterRoutes = require('./routes/fighterRoutes');

const app = express();
const port = process.env.PORT || 3000;

// Middleware
app.use(cors());
// Increase payload limit to 10MB to handle base64 images
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ limit: '10mb', extended: true }));

// Request logging middleware
app.use((req, res, next) => {
  console.log(`${req.method} ${req.url}`);
  next();
});

// Disable caching for GET requests to ensure 200 responses instead of 304
app.use((req, res, next) => {
  if (req.method === 'GET') {
    res.set('Cache-Control', 'no-store, no-cache, must-revalidate, private');
    res.set('Expires', '-1');
    res.set('Pragma', 'no-cache');
  }
  next();
});

// Swagger configuration
const swaggerDocument = require('../swagger.json');
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));

// Routes
app.use('/api/users', userRoutes);
app.use('/api/fighters', fighterRoutes);

// Initialize default data if not exists
const { initializeDefaultData } = require('./models/localStorage');
initializeDefaultData();

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});