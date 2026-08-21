import express from "express";
import { errorHandlerMiddleware } from "./middleware/error-middleware.js";

const app = express();
const PORT = 3000;

app.get("/", (req, res) => {
  res.send("Hello, World!");
});
app.use(errorHandlerMiddleware);
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});