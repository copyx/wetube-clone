import routes from "../routes";
import Video from "../models/Video";
import Comment from "../models/Comment";
import { deleteS3Object } from "../aws";

export const home = async (req, res) => {
  try {
    const videos = await Video.find({}).sort({ _id: -1 });
    res.render("home", { pageTitle: "Home", videos });
  } catch (error) {
    console.error(`❌ Error: ${error}`);
    res.render("home", { pageTitle: "Home", videos: [] });
  }
};

export const search = async (req, res) => {
  const {
    query: { term: searchingBy },
  } = req;

  let videos = [];

  try {
    videos = await Video.find({
      title: { $regex: searchingBy, $options: "i" },
    });
  } catch (error) {
    console.error(`❌ Error: ${error}`);
  }

  res.render("search", { pageTitle: "Search", searchingBy, videos });
};
export const getUpload = (req, res) =>
  res.render("upload", { pageTitle: "Upload" });
export const postUpload = async (req, res) => {
  const {
    body: { title, description },
    file: { location },
  } = req;

  try {
    console.log(req.file);
    const newVideo = await Video.create({
      fileUrl: location,
      title,
      description,
      creator: req.user.id,
    });
    req.user.videos.push(newVideo.id);
    req.user.save();
    res.redirect(routes.videos + routes.videoDetail(newVideo.id));
  } catch (error) {
    console.error(`❌ Error: ${error}`);
    res.redirect(routes.upload);
  }
};

export const videoDetail = async (req, res) => {
  const {
    params: { id },
  } = req;

  try {
    const video = await Video.findById(id)
      .populate("creator")
      .populate("comments");
    res.render("videoDetail", { pageTitle: video.title, video });
  } catch (error) {
    console.error(`❌ Error: ${error}`);
    res.redirect(routes.home);
  }
};

export const getEditVideo = async (req, res) => {
  const {
    params: { id },
  } = req;

  try {
    const video = await Video.findById(id);

    if (video.creator != req.user.id) {
      throw Error("Wrong user");
    } else {
      res.render("editVideo", { pageTitle: `Edit ${video.title}`, video });
    }
  } catch (error) {
    console.error(`❌ Error: ${error}`);
    res.redirect(routes.videos + routes.videoDetail(id));
  }
};

export const postEditVideo = async (req, res) => {
  const {
    params: { id },
    body: { title, description },
  } = req;

  try {
    await Video.findOneAndUpdate({ _id: id }, { title, description });
    res.redirect(routes.videos + routes.videoDetail(id));
  } catch (error) {
    console.error(`❌ Error: ${error}`);
    res.redirect(routes.videos + routes.editVideo(id));
  }
};

export const deleteVideo = async (req, res) => {
  const {
    params: { id },
  } = req;

  try {
    const video = await Video.findOneAndRemove({
      _id: id,
      creator: req.user.id,
    });
    deleteS3Object(video.fileUrl);
    await Comment.deleteMany({ _id: { $in: video.comments } });
    res.redirect(routes.home);
  } catch (error) {
    console.error(`❌ Error: ${error}`);
    res.redirect(routes.videos + routes.deleteVideo(id));
  }
};

export const postRegisterView = async (req, res) => {
  const {
    params: { id },
  } = req;

  try {
    const video = await Video.findById(id);
    video.views++;
    video.save();
    res.status(200);
  } catch (error) {
    console.error(error);
    res.status(400);
  } finally {
    res.end();
  }
};

export const postAddComment = async (req, res) => {
  const {
    params: { id },
    body: { comment },
    user,
  } = req;

  try {
    const video = await Video.findById(id);
    const newComment = await Comment.create({
      text: comment,
      creator: user.id,
    });
    video.comments.push(newComment.id);
    video.save();
    res.json({ commentId: newComment.id });
    res.status(200);
  } catch (error) {
    console.error(error);
    res.status(400);
  } finally {
    res.end();
  }
};

export const deleteComment = async (req, res) => {
  const {
    params: { videoId, commentId },
  } = req;

  try {
    await Comment.findByIdAndDelete(commentId);
    const video = await Video.findById(videoId);
    video.comments.splice(
      video.comments.findIndex((comment) => comment.id === commentId),
      1
    );
    video.save();
    res.status(200);
  } catch (error) {
    console.error(error);
    res.status(400);
  } finally {
    res.end();
  }
};