import { SwaggerDefinition } from "swagger-jsdoc";

const swaggerDefinition: SwaggerDefinition = {
  openapi: "3.0.0",
  info: {
    title: "Express API with OpenAPI",
    version: "1.0.0",
    description: "A simple Express API application documented with OpenAPI",
  },
  servers: [
    {
      url: "http://localhost:3000/api",
      description: "Development server",
    },
  ],
  components: {
    schemas: {
      User: {
        type: "object",
        required: ["firstName", "lastName", "email", "password"],
        properties: {
          id: {
            type: "integer",
            description: "The auto-generated id of the user",
          },
          firstName: {
            type: "string",
            description: "First name of the user",
          },
          lastName: {
            type: "string",
            description: "Last name of the user",
          },
          email: {
            type: "string",
            description: "Email of the user",
          },
          password: {
            type: "string",
            description: "Password of the user",
          },
          createdAt: {
            type: "string",
            format: "date-time",
            description: "The date the user was added",
            readOnly: true,
          },
          updatedAt: {
            type: "string",
            format: "date-time",
            description: "The date the user was last updated",
            readOnly: true,
          },
        },
      },
    },
  },
};

export default swaggerDefinition;
