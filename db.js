import mongoose from "mongoose";

mongoose.connect("mongodb://localhost:27017/wetube", {
  useNewUrlParser: true,
  useFindAndModify: false,
});

const db = mongoose.connection;

db.once("open", () => {
  console.log("👍 Connected to DB");
});
db.on("error", (error) => {
  console.error(`🚨 Error on DB Connection: ${error}`);
});
