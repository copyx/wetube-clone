import express from "express";
import morgan from "morgan";
import helmet from "helmet";
import cookieParser from "cookie-parser";
import bodyParser from "body-parser";
import passport from "passport";
import mongoose from "mongoose";
import session from "express-session";
import MongoStore from "connect-mongo";

import globalRouter from "./routers/globalRouter";
import userRouter from "./routers/userRouter";
import videoRouter from "./routers/videoRouter";
import routes from "./routes";
import { localsMiddleware } from "./middlewares";
import "./passport";

const app = express();
const CookieStore = MongoStore(session);

app.use(
  helmet({
    contentSecurityPolicy: {
      directives: {
        defaultSrc: ["'self'"],
        scriptSrc: ["'self'", "https://*.fontawesome.com/"],
        connectSrc: ["'self'", "https://*.fontawesome.com/"],
        styleSrc: [
          "'self'",
          "https://*.fontawesome.com/",
          "'sha256-AQe0kMnttwVvXWV4LutnFsTIDltiV/z7MUyXkuK3q8s='",
          "'sha256-z/+epQIZWnuW/jjeypGIpZt1je7sws1OeK6n2RHmOMY='",
          "'sha256-0Are7I5XVWX8M2W//5ynKqlRK4x/pFz+uk/fLMvXj3E='",
        ],
        fontSrc: ["'self'", "https://*.fontawesome.com/"],
        mediaSrc: ["'self'", "https://archive.org/", "https://*.archive.org/"],
        imgSrc: ["'self'", "https://*.githubusercontent.com/"],
      },
    },
  })
);
app.set("view engine", "pug");
app.use("/uploads", express.static("uploads"));
app.use("/static", express.static("static"));
app.use(cookieParser());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(morgan("dev"));
app.use(
  session({
    secret: process.env.COOKIE_SECRET,
    resave: true,
    saveUninitialized: false,
    store: new CookieStore({ mongooseConnection: mongoose.connection }),
  })
);
app.use(passport.initialize());
app.use(passport.session());

app.use(localsMiddleware);

app.use(routes.home, globalRouter);
app.use(routes.users, userRouter);
app.use(routes.videos, videoRouter);

export default app;
