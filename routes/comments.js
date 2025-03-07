const express = require("express");
const router = express.Router();
const {
  createComment,
  getComment,
  getComments,
  updateComment,
  deleteComment,
} = require("../controllers/comments");

router.post("/:postId/comments/", createComment);
router.get("/:postId/comments", getComments);
router.get("/:postId/comments/:commentId", getComment);
router.put("/:postId/comments/:commentId", updateComment);
router.delete("/:postId/comments/:commentId", deleteComment);

module.exports = router;
