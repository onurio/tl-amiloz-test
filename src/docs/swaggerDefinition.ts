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
                  email: { $ref: "#/components/schemas/Email" },
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
    "/usuarios/{userId}/prestamos": {
      post: {
        summary: "Create a loan based on a selected offer",
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
                required: ["offerId"],
                properties: {
                  offerId: {
                    type: "integer",
                    description: "ID of the selected offer",
                  },
                },
              },
            },
          },
        },
        responses: {
          201: {
            description: "Loan created",
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    loan: { $ref: "#/components/schemas/Loan" },
                  },
                },
              },
            },
          },
          400: { description: "Invalid input" },
          404: { description: "User or Offer not found" },
        },
      },
    },
    "/prestamos/{loanId}/pagos": {
      post: {
        summary: "Apply a payment to a loan",
        tags: ["Payment"],
        parameters: [
          {
            in: "path",
            name: "loanId",
            required: true,
            schema: { type: "integer" },
            description: "ID of the loan",
          },
        ],
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: {
                type: "object",
                required: ["amount"],
                properties: {
                  amount: {
                    type: "number",
                    description: "Amount of the payment",
                  },
                },
              },
            },
          },
        },
        responses: {
          201: {
            description: "Payment applied",
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    loan: { $ref: "#/components/schemas/Loan" },
                  },
                },
              },
            },
          },
          400: { description: "Invalid input" },
          404: { description: "Loan not found" },
        },
      },
    },
    "/pagos/{paymentId}/revertir": {
      post: {
        summary: "Revert a payment",
        tags: ["Payment"],
        parameters: [
          {
            in: "path",
            name: "paymentId",
            required: true,
            schema: { type: "integer" },
            description: "ID of the payment",
          },
        ],
        responses: {
          200: {
            description: "Payment reverted",
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    loan: { $ref: "#/components/schemas/Loan" },
                  },
                },
              },
            },
          },
          404: { description: "Payment or loan not found" },
          500: { description: "Internal server error" },
        },
      },
    },
  },
  components: {
    schemas: {
      Email: {
        type: "string",
        format: "email",
        pattern: "^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\\.[a-zA-Z]{2,}$",
        description: "Email address of the user",
      },
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
            $ref: "#/components/schemas/Email",
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
            description: "The term of the offer in weeks",
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
      Loan: {
        type: "object",
        required: ["offerId", "amount", "term", "interestRate"],
        properties: {
          id: {
            type: "integer",
            readOnly: true,
            description: "The auto-generated id of the loan",
          },
          userId: { type: "integer", description: "The id of the user" },
          offerId: { type: "integer", description: "The id of the offer" },
          amount: { type: "number", description: "The amount of the loan" },
          term: {
            type: "integer",
            description: "The term of the loan in weeks",
          },
          interestRate: {
            type: "number",
            description: "The interest rate of the loan in percentage",
          },
          isPaid: {
            type: "boolean",
            description: "Whether the loan is fully paid",
          },
          createdAt: {
            type: "string",
            format: "date-time",
            readOnly: true,
            description: "The date the loan was added",
          },
          updatedAt: {
            type: "string",
            format: "date-time",
            readOnly: true,
            description: "The date the loan was last updated",
          },
        },
      },
      Payment: {
        type: "object",
        required: ["amount", "amountPaid", "dueDate"],
        properties: {
          id: {
            type: "integer",
            readOnly: true,
            description: "The auto-generated id of the payment",
          },
          loanId: { type: "integer", description: "The id of the loan" },
          amount: { type: "number", description: "The amount of the payment" },
          amountPaid: { type: "number", description: "The amount paid so far" },
          dueDate: {
            type: "string",
            format: "date-time",
            description: "The due date of the payment",
          },
          createdAt: {
            type: "string",
            format: "date-time",
            readOnly: true,
            description: "The date the payment was added",
          },
          updatedAt: {
            type: "string",
            format: "date-time",
            readOnly: true,
            description: "The date the payment was last updated",
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
