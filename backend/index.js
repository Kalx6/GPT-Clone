import express from "express";
import db from "./db/db.config.js";
import mainRouter from "./src/api/main.route.js";
const app = express();

app.use("/api", mainRouter);

// app.get("/api/chat/conversations", (req, res) => {
//   res.send("GET METHOD");
// });

// app.post("/api/chat/conversations", (req, res) => {
//   res.send("POST METHOD");
// });
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
