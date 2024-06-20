import { OpenAPIV3 } from "express-openapi-validator/dist/framework/types";

const swaggerDefinition: OpenAPIV3.Document = {
  openapi: "3.0.0",
  info: {
    title: "Express API with OpenAPI",
    version: "1.0.0",
    description: "A simple Express API application documented with OpenAPI",
  },
  servers: [
    {
      url: "http://localhost:3000/",
      description: "Development server",
    },
  ],
  paths: {
    "/auth/login": {
      post: {
        summary: "Login a user",
        tags: ["Auth"],
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: {
                type: "object",
                required: ["email", "password"],
                properties: {
                  email: {
                    type: "string",
                    description: "The user's email address",
                  },
                  password: {
                    type: "string",
                    description: "The user's password",
                  },
                },
              },
            },
          },
        },
        responses: {
          200: {
            description: "The user was successfully logged in",
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    user: { $ref: "#/components/schemas/User" },
                    token: { type: "string" },
                  },
                },
              },
            },
          },
          401: { description: "Invalid email or password" },
        },
      },
    },
    "/auth/check": {
      get: {
        summary: "Check if user is authenticated",
        tags: ["Auth"],
        security: [{ bearerAuth: [] }],
        responses: {
          200: {
            description: "User is authenticated",
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    message: { type: "string" },
                  },
                },
              },
            },
          },
          401: { description: "Unauthorized" },
        },
      },
    },
    "/usuarios": {
      post: {
        summary: "Create a new user",
        tags: ["User"],
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: { $ref: "#/components/schemas/User" },
            },
          },
        },
        responses: {
          201: {
            description: "The user was successfully created",
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/User" },
              },
            },
          },
          400: { description: "Bad request" },
        },
      },
    },
    "/usuarios/{userId}/ofertas": {
      post: {
        summary: "Create loan offers for a user",
        tags: ["User"],
        parameters: [
          {
            in: "path",
            name: "userId",
            required: true,
            schema: { type: "integer" },
            description: "ID of the user",
          },
        ],
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: {
                type: "object",
                properties: {
                  offers: {
                    type: "array",
                    items: { $ref: "#/components/schemas/Offer" },
                  },
                },
              },
            },
          },
        },
        responses: {
          201: {
            description: "Offers created",
            content: {
              "application/json": {
                schema: {
                  type: "array",
                  items: { $ref: "#/components/schemas/Offer" },
                },
              },
            },
          },
          400: { description: "Invalid input" },
          404: { description: "User not found" },
        },
      },
    },
  },
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
      Offer: {
        type: "object",
        required: ["amount", "term", "interestRate"],
        properties: {
          id: {
            type: "integer",
            readOnly: true,
            description: "The auto-generated id of the offer",
          },
          userId: { type: "integer", description: "The id of the user" },
          amount: { type: "number", description: "The amount of the offer" },
          term: {
            type: "integer",
            description: "The term of the offer in months",
          },
          interestRate: {
            type: "number",
            description: "The interest rate of the offer in percentage",
          },
          createdAt: {
            type: "string",
            format: "date-time",
            readOnly: true,
            description: "The date the offer was added",
          },
          updatedAt: {
            type: "string",
            format: "date-time",
            readOnly: true,
            description: "The date the offer was last updated",
          },
        },
      },
    },
    securitySchemes: {
      bearerAuth: {
        type: "http",
        scheme: "bearer",
        bearerFormat: "JWT",
      },
    },
  },
};

export default swaggerDefinition;
