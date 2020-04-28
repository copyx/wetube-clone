import express from "express";
import morgan from "morgan";
import helmet from "helmet";
import bodyParser from "body-parser";
import cookieParser from "cookie-parser";
const app = express();
const port = 3000;

const betweenHome = (req, res, next) => {
  console.log("I'm between");
  next();
};

app.use(cookieParser());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(helmet());
app.use(morgan("common"));

app.get("/", (req, res) => res.send("Hello World!"));
app.use(betweenHome);
app.get("/test", (req, res) => res.send("This is test!"));

app.listen(port, () =>
  console.log(`Example app listening at http://localhost:${port}`)
);
