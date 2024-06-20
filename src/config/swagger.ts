import swaggerJsdoc from "swagger-jsdoc";
import swaggerDefinition from "../docs/swaggerDefinition";

const options = {
  swaggerDefinition,
  apis: ["./src/routes/*.ts"],
};

const swaggerSpec = swaggerJsdoc(options);

export default swaggerSpec;
