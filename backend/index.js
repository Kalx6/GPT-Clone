import express from "express";
import db from "./db/db.config.js";
import mainRouter from "./src/api/main.route.js";
import errorHandler from "./src/middleware/errorHandler.js";
const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use("/api", mainRouter);

app.use(errorHandler);


async function startServer() {
  try {
    const connection = await db.getConnection();
    console.log("Database connected");
    connection.release();
    // console.log(connection);
    app.listen(3000, () => {
      console.log("Server is running on port 3000");
    });
  } catch (error) {
    console.error(error);
  }
}

startServer();
