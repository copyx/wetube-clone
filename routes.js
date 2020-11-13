const routes = {
  // Global
  home: "/",
  join: "/join",
  login: "/login",
  me: "/me",
  logout: "/logout",
  search: "/search",

  // Users
  users: "/users",
  editProfile: "/edit-profile",
  changePassword: "/change-password",
  userDetail: (id) => (id ? `/${id}` : "/:id"),

  // Videos
  videos: "/videos",
  upload: "/upload",
  videoDetail: (id) => (id ? `/${id}` : "/:id"),
  editVideo: (id) => (id ? `/${id}/edit` : "/:id/edit"),
  deleteVideo: (id) => (id ? `/${id}/delete` : "/:id/delete"),

  // Auth
  github: "/auth/github",
  githubCallback: "/auth/github/callback",

  // API
  api: "/api",
  registerView: "/:id/view",
};

export default routes;
