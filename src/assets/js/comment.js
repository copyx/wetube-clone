import axios from "axios";

const addCommentForm = document.getElementById("jsAddComment");
const commentList = document.getElementById("jsCommentList");
const commentNumber = document.getElementById("jsCommentNumber");

const increaseCommentNumber = () => {
  commentNumber.innerHTML = parseInt(commentNumber.innerHTML, 10) + 1;
};

const decreaseCommentNumber = () => {
  commentNumber.innerHTML = parseInt(commentNumber.innerHTML, 10) - 1;
};

const addComment = (comment, commentId) => {
  const li = document.createElement("li");
  const span = document.createElement("span");
  const i = document.createElement("i");

  i.classList.add("fas", "fa-trash-alt", "comment__delete");
  i.addEventListener("click", handleDelete);
  span.innerHTML = comment;
  li.appendChild(span);
  li.appendChild(i);
  li.setAttribute("comment-id", commentId);
  commentList.prepend(li);
  increaseCommentNumber();
};

const requestAddComment = async (comment) => {
  const videoId = window.location.pathname.split("/videos/")[1];
  const response = await axios({
    url: `/api/${videoId}/comment`,
    method: "POST",
    data: {
      comment,
    },
  });

  if (response.status === 200) {
    addComment(comment, response.data.commentId);
  }
};

const handleSubmit = (event) => {
  event.preventDefault();
  const commentInput = addCommentForm.querySelector("input");
  const comment = commentInput.value;
  requestAddComment(comment);
  commentInput.value = "";
};

const reqeustDeleteComment = async (comment) => {
  const commentId = comment.getAttribute("comment-id");
  const videoId = window.location.pathname.split("/videos/")[1];
  const response = await axios({
    url: `/api/${videoId}/comment/${commentId}`,
    method: "DELETE",
  });

  if (response.status === 200) {
    comment.remove();
    decreaseCommentNumber();
  }
};

const handleDelete = (event) => {
  event.preventDefault();
  event.stopPropagation();
  const { target } = event;
  const comment = target.parentNode;
  reqeustDeleteComment(comment);
};

function init() {
  addCommentForm.addEventListener("submit", handleSubmit);
  const deleteBtns = document.querySelectorAll(".comment__delete");
  for (const deleteBtn of deleteBtns) {
    deleteBtn.addEventListener("click", handleDelete);
  }
}

if (addCommentForm) {
  init();
}
