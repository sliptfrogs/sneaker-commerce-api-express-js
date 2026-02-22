import swaggerAutogen from 'swagger-autogen';

const doc = {
  info: {
    title: 'E-Commerce API',
    description: 'API documentation',
    version: '1.0.0',
  },
  host: 'localhost:3000',
  basePath: '/v1/api',
  schemes: ['http'],
};

const outputFile = './swagger-output.json';
const routes = ['./app.js']; // Your main app file

swaggerAutogen()(outputFile, routes, doc);
