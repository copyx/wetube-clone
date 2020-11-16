import "@babel/polyfill";
import "./db";
import app from "./app";
import dotenv from "dotenv";

dotenv.config();

import "./models/Video";
import "./models/Comment";
import "./models/User";

const port = process.env.PORT || 3000;

app.listen(port, () => {
  if (process.env.NODE_ENV == "production") {
    console.log(`✅ Listening on: ${process.env.ROOT_URL}:${port}`);
  } else {
    console.log(`✅ Listening on: http://localhost:${port}`);
  }
});
