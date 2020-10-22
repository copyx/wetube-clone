const routes = {
  // Global
  home: "/",
  join: "/join",
  login: "/login",
  logout: "/logout",
  search: "/search",

  // Users
  users: "/users",
  editProfile: "/edit-profile",
  changePassword: "/change-password",
  userDetail: "/:id",

  // Videos
  videos: "/videos",
  upload: "/upload",
  videoDetail: "/:id",
  editVideo: "/:id/edit",
  deleteVideo: "/:id/delete",
};

export default routes;
