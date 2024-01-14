export const options = {
    definition: {
        openapi: "3.0.0",
        info: {
            title: "Copybase Relatorios",
            version: "0.1.0",
            description: "Essa é a documentação completa da API Copybase Relatorios"            
        },
        schemes: ["http"],
        servers: [
            {
                url: process.env.SWAGGER_BASE_SERVER
            }
        ],
    },
    apis: [
        process.env.SWAGGER_DOCS_PATH + '/api-relatorios.yaml'
    ]
}