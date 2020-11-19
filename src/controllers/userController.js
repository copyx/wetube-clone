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
    req.flash("error", "Passwords don't match");
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
  successFlash: "Welcome",
  failureFlash: "Can't log in. Check email and password",
});

export const getGithubLogin = passport.authenticate("github", {});
export const getGithubLoginCallback = passport.authenticate("github", {
  failureFlash: "Can't log in at this time",
  failureRedirect: routes.login,
});
export const successGithubAuthenticate = (req, res) => {
  req.flash("success", "Welcome");
  res.redirect(routes.home);
};

// TODO: Add facebook login

export const logout = (req, res) => {
  req.flash("info", "Logged out, see you later");
  req.logout();
  res.redirect(routes.home);
};

export const getMe = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).populate("videos");
    res.render("userDetail", { pageTitle: "My Detail", user });
  } catch (error) {
    req.flash("error", "User not found");
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
    req.flash("error", "User not found");
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

    req.flash("success", "Profile updated");
    res.redirect(routes.me);
  } catch (error) {
    req.flash("error", "Can't update profile");
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
      req.flash("error", "Passwords don't match");
      res.status(400);
      res.redirect(routes.users + routes.changePassword);
      return;
    }

    await req.user.changePassword(oldPassword, newPassword);
    req.flash("success", "Your password is changed");
    res.redirect(routes.me);
  } catch (error) {
    req.flash("error", "Can't change password");
    console.error(error);
    res.redirect(routes.users + routes.changePassword);
  }
};
