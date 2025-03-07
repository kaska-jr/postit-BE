const express = require("express");
const router = express.Router();

const {
  updateUser,
  deleteUser,
  getUser,
  getAllUsers,
  getUserPosts,
  getUserPost,
  getUserPostComments,
  getUserPostComment,
  getUserByHandle,
  getUserPostsByHandle,
} = require("../controllers/users");

router.get("/", getAllUsers);
router.get("/@:username", getUserByHandle);
router.get("/@:username/posts", getUserPostsByHandle);
router.put("/:userId", updateUser);
router.delete("/:userId", deleteUser);
router.get("/:userId", getUser);
router.get("/:userId/posts", getUserPosts);
router.get("/:userId/posts/:postId", getUserPost);
router.get("/:userId/posts/:postId/comments", getUserPostComments);
router.get("/:userId/posts/:postId/comments/:commentId", getUserPostComment);

module.exports = router;
