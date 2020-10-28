import passport from "passport";
import GithubStrategy from "passport-github";
import User from "./models/User";
import routes from "./routes";

passport.use(User.createStrategy());

passport.use(
  new GithubStrategy.Strategy(
    {
      clientID: process.env.GITHUB_CLIENT_ID,
      clientSecret: process.env.GITHUB_CLIENT_SECRET,
      callbackURL: `http://localhost:3000${routes.githubCallback}`,
    },
    async (accessToken, refreshToken, profile, cb) => {
      const {
        _json: { id, avatar_url, name, email },
      } = profile;

      try {
        const user = await User.findOne({ email });

        if (user) {
          user.githubId = id;
          user.save();
          return cb(null, user);
        }

        const newUser = await User.create({
          email,
          name,
          githubId: id,
          avatarUrl: avatar_url,
        });
        return cb(null, newUser);
      } catch (error) {
        return cb(error);
      }
    }
  )
);

passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());
