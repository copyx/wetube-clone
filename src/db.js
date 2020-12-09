import mongoose from "mongoose";

let mongoUrl;

switch (process.env.NODE_ENV) {
  case "production":
    mongoUrl = process.env.PROD_MONGO_URL;
    break;
  case "development":
    mongoUrl = process.env.DEV_MONGO_URL;
    break;
  case "test":
    mongoUrl = process.env.TEST_MONGO_URL;
    break;
}

const connect = () => {
  mongoose.connect(mongoUrl, {
    useNewUrlParser: true,
    useFindAndModify: false,
    useUnifiedTopology: true,
  });

  const db = mongoose.connection;

  db.on("open", () => {
    console.log("✅ Connected to DB");
  });

  db.on("error", (error) => {
    console.error(`❌ Error: ${error}`);
  });
};

const disconnect = (callback) => {
  mongoose.connection.close(() => {
    console.log("🛑 Disconnected from DB");
    if (callback) {
      callback();
    }
  });
};

export default {
  connect,
  disconnect,
};
