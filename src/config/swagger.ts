import swaggerJsdoc from "swagger-jsdoc";
import swaggerDefinition from "@/docs/swaggerDefinition";

const options = {
  swaggerDefinition,
  apis: ["./src/**/*.ts", "./src/**/*.js"],
};

const swaggerSpec = swaggerJsdoc(options);

export default swaggerSpec;
