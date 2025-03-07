const express = require("express");
const router = express.Router();

const {
  createPost,
  getPost,
  getAllPosts,
  updatePost,
  deletePost,
} = require("../controllers/posts");

router.post("/", createPost);
router.get("/", getAllPosts);
router.get("/:postId", getPost);
router.put("/:postId", updatePost);
router.delete("/:postId", deletePost);

module.exports = router;
