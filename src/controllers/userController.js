import routes from "../routes";
import User from "../models/User";
import passport from "passport";
import { deleteS3Object } from "../aws";

export const getJoin = (req, res) => res.render("join", { pageTitle: "Join" });
export const postJoin = async (req, res, next) => {
  console.log(req.body);
  const {
    body: { name, email, password, password2 },
  } = req;

  if (password !== password2) {
    res.status(400);
    res.render("join", { pageTitle: "Join" });
  } else {
    try {
      const user = await User({ name, email });
      await User.register(user, password);
      next();
    } catch (error) {
      // TODO: Handle error cases
      console.error(error);
      res.redirect(routes.home);
    }
  }
};

export const getLogin = (req, res) =>
  res.render("login", { pageTitle: "Login" });
export const postLogin = passport.authenticate("local", {
  failureRedirect: routes.login,
  successRedirect: routes.home,
});

export const getGithubLogin = passport.authenticate("github");
export const getGithubLoginCallback = passport.authenticate("github", {
  failureRedirect: routes.login,
});
export const successGithubAuthenticate = (req, res) => {
  res.redirect(routes.home);
};

// TODO: Add facebook login

export const logout = (req, res) => {
  req.logout();
  res.redirect(routes.home);
};

export const getMe = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).populate("videos");
    res.render("userDetail", { pageTitle: "My Detail", user });
  } catch (error) {
    console.error(error);
    res.redirect(routes.home);
  }
};

export const userDetail = async (req, res) => {
  const {
    params: { id },
  } = req;

  try {
    const user = await User.findById(id).populate("videos");
    res.render("userDetail", { pageTitle: "User Detail", user });
  } catch (error) {
    console.error(error);
    res.redirect(routes.home);
  }
};

export const getEditProfile = (req, res) =>
  res.render("editProfile", { pageTitle: "Edit Profile" });

export const postEditProfile = async (req, res) => {
  const {
    user,
    body: { name, email },
    file,
  } = req;

  try {
    await User.findByIdAndUpdate(user.id, {
      name,
      email,
      avatarUrl: file ? file.location : user.avatarUrl,
    });

    if (file) {
      deleteS3Object(user.avatarUrl);
    }

    res.redirect(routes.me);
  } catch (error) {
    console.error(error);
    res.render("editProfile", { pageTitle: "Edit Profile" });
  }
};

export const getChangePassword = (req, res) =>
  res.render("changePassword", { pageTitle: "Change Password" });

export const postChangePassword = async (req, res) => {
  const {
    body: { oldPassword, newPassword, newPassword2 },
  } = req;

  try {
    if (newPassword !== newPassword2) {
      res.status(400);
      res.redirect(routes.users + routes.changePassword);
      return;
    }

    await req.user.changePassword(oldPassword, newPassword);
    res.redirect(routes.me);
  } catch (error) {
    console.error(error);
    res.redirect(routes.users + routes.changePassword);
  }
};