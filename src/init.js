import db from "./db";
db.connect();
import app from "./app";

const port = process.env.PORT || 3000;

const server = app.listen(port, () => {
  if (process.env.NODE_ENV == "production") {
    console.log(`✅ Listening on: ${process.env.ROOT_URL}:${port}`);
  } else {
    console.log(`✅ Listening on: http://localhost:${port}`);
  }
});

const shutDownGracefully = () => {
  console.log("\nSIGINT or SIGTERM is received. Shut down gracefully.");
  server.close(() => {
    console.log("🛑 Server closed");
    db.disconnect(() => {
      process.exit(0);
    });
  });
};

process.on("SIGTERM", shutDownGracefully);
process.on("SIGINT", shutDownGracefully);
process.on("SIGUSR2", shutDownGracefully); // For Nodemon
