import swaggerJSDoc from "swagger-jsdoc";

const options = {
    definition: {
        openapi: '3.0.0',
        info: {
            title: 'REST API Docs',
            version: '1.0.0',
            description: 'Rasa Kopi API Documentation',
        },
        servers: [
            {
                url: 'http://localhost:3000/api/{version}',
                description: 'Development server',
                variables: {
                    version: {
                        default: 'v1',
                        enum: ['v1', 'v2'], 
                        description: 'API version',
                    },
                },
            },
            {
                url: 'https://api.example.com/api/{version}',
                description: 'Staging server',
                variables: {
                    version: {
                        default: 'v1',
                        enum: ['v1', 'v2'], 
                        description: 'API version',
                    },
                },
            },
            {
                url: 'https://api.example.com/api/{version}',
                description: 'Production server',
                variables: {
                    version: {
                        default: 'v1',
                        enum: ['v1', 'v2'],
                        description: 'API version',
                    },
                },
            },
        ],
    },
    apis: ['./src/domains/**/*.yaml'], // Path to your API files
};

const swaggerSpec = swaggerJSDoc(options);

export default swaggerSpec;
