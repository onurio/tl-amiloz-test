import express from "express";
import sequelize from "./models";

const app = express();
const port = 3000;

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

sequelize
  .sync()
  .then(() => {
    app.listen(port, () => {
      console.log(`Server is running on http://localhost:${port}`);
    });
  })
  .catch((err: any) => {
    console.error("Unable to connect to the database:", err);
  });
