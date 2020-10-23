import "./db";
import app from "./app";
import dotenv from "dotenv";
dotenv.config();

const port = process.env.PORT || 3000;

app.listen(port, () => {
  console.log(`✅ Listening on: http://localhost:${port}`);
});
