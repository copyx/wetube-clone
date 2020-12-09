import db from "./db";
db.connect();
import app from "./app";

const port = process.env.PORT || 3000;

app.listen(port, () => {
  if (process.env.NODE_ENV == "production") {
    console.log(`✅ Listening on: ${process.env.ROOT_URL}:${port}`);
  } else {
    console.log(`✅ Listening on: http://localhost:${port}`);
  }
});
