"use strict";
const swaggerAutogen = require('swagger-autogen')();
const doc = {
    info: {
        title: 'RESUME VANTAGE',
        description: 'API Documentation for resumevantage',
    },
    host: 'localhost:3000', // Change this to your actual host
    schemes: ['http'],
    basePath: '/auth',
    tags: [
        {
            name: 'Onboarding', // Tag name
            description: 'User register and login' // Tag description
        },
        // { ... }
    ],
    components: {
        schemas: {
            Registration: {
                type: 'object',
                tag: 'Onboarding',
                required: ['name', 'email', 'password'],
                properties: {
                    name: { type: 'string' },
                    email: { type: 'string', format: 'email' },
                    password: { type: 'string', format: 'password' },
                },
            },
            Login: {
                type: 'object',
                required: ['email', 'password'],
                properties: {
                    email: { type: 'string', format: 'email' },
                    password: { type: 'string', format: 'password' },
                },
            },
            EmailOnly: {
                type: 'object',
                required: ['email'],
                properties: {
                    email: { type: 'string', format: 'email' },
                },
            },
        },
    },
};
const outputFile = './swagger-output.json';
const endpointsFiles = ['./routes/auth.js'];
swaggerAutogen(outputFile, endpointsFiles, doc);
