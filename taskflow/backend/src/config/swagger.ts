import swaggerJsdoc from "swagger-jsdoc";
import swaggerUi from "swagger-ui-express";

const options = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "API TaskFlow",
      version: "1.0.0",
      description: "Documentação da API TaskFlow com Swagger UI",
    },
    servers: [
      {
        url: "http://localhost:25060",
      },
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: "http",
          scheme: "bearer",
          bearerFormat: "JWT",
        },
      },
    },
  },
  apis: [
    "./src/routes/authRoutes.ts",
    "./src/routes/taskRoutes.ts",

    "./src/docs/auth.docs.ts",
    "./src/docs/tasks.docs.ts",

    "./src/controllers/authController.ts",
    "./src/controllers/taskController.ts",
  ],
};

const swaggerSpec = swaggerJsdoc(options);

export { swaggerUi, swaggerSpec };
