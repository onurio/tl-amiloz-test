import "dotenv/config";
import express, { NextFunction } from "express";
import { Request, Response } from "express";
import sequelize from "./models";
import userRoutes from "@routes/userRoutes";
import authRoutes from "@routes/authRoutes";
import bodyParser from "body-parser";
import swaggerUi from "swagger-ui-express";
import swaggerSpec from "@config/swagger";
import { middleware as OpenApiValidator } from "express-openapi-validator";
import { OpenApiValidatorOpts } from "express-openapi-validator/dist/framework/types";

const app = express();
const port = 3000;

app.use(bodyParser.json());
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));

const validatorOptions: OpenApiValidatorOpts = {
  apiSpec: swaggerSpec as any,
  validateRequests: true,
};

app.use(OpenApiValidator(validatorOptions));

app.use("/auth", authRoutes);
app.use("/usuarios", userRoutes);

app.get("/", async (req: any, res: any) => {
  let isDbConnected = false;
  try {
    await sequelize.authenticate();
    isDbConnected = true;
  } catch (error) {
    isDbConnected = false;
  }
  return res.json({
    status: "online",
    database: isDbConnected ? "connected" : "disconnected",
  });
});

app.use((err: any, req: Request, res: Response, next: NextFunction) => {
  res.status(err.status || 500).json({
    message: err.message,
    errors: err.errors,
  });
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
