const { StatusCodes } = require("http-status-codes");
const { BadRequestError } = require("../errors");
const Comment = require("../models/Comment");
const Post = require("../models/Post");
const User = require("../models/User");

const createComment = async (req, res) => {
  const { userId } = req.user;
  const { postId } = req.params;
  const { comment } = req.body;

  if (!comment) {
    throw new BadRequestError("Please provide a comment");
  }

  const post = await Post.findOne({ _id: postId });

  if (!post) {
    throw new BadRequestError(`Post with id ${postId} does not exist`);
  }
  const commentUser = User.findOne({ _id: userId });
  if (!commentUser) {
    throw new BadRequestError(`User with id ${userId} does not exist`);
  }
  const newComment = await Comment.create({
    post_id: postId,
    post_user_id: post.user_id,
    comment_user_id: userId,
    comment_message: comment,
  });
  res
    .status(StatusCodes.CREATED)
    .json({ msg: "Comment created successfully", newComment });
};

const updateComment = async (req, res) => {
  const { commentId, postId } = req.params;
  const { userId } = req.user;
  if (!req.body.comment) {
    throw new BadRequestError("Please provide a comment");
  }
  const post = await Post.findOne({ _id: postId });
  if (!post) {
    throw new BadRequestError(`Post with id ${postId} does not exist`);
  }
  const comment = await Comment.findOne({ _id: commentId });
  if (!comment) {
    throw new BadRequestError(`Comment with id ${commentId} does not exist`);
  }
  const user = await User.findOne({ _id: userId });
  if (!user) {
    throw new BadRequestError(`User with id ${userId} does not exist`);
  }
  if (comment.comment_user_id.toString() !== userId) {
    throw new BadRequestError("You are not authorized to update this comment");
  }
  const updatedComment = await Comment.findOneAndUpdate(
    { _id: commentId },
    { comment_message: req.body.comment },
    { new: true }
  );

  res
    .status(StatusCodes.OK)
    .json({ msg: "Comment updated successfully", updatedComment });
};

const deleteComment = async (req, res) => {
  const { commentId, postId } = req.params;
  const { userId } = req.user;
  const post = await Post.findOne({ _id: postId });
  if (!post) {
    throw new BadRequestError(`Post with id ${postId} does not exist`);
  }
  const user = await User.findOne({ _id: userId });
  if (!user) {
    throw new BadRequestError(`User with id ${userId} does not exist`);
  }
  await Comment.findOneAndDelete({ _id: commentId, comment_user_id: userId });
  res.status(StatusCodes.OK).json({ msg: "Comment deleted successfully" });
};

const getComments = async (req, res) => {
  const { postId } = req.params;
  const post = await Post.findOne({ _id: postId });
  if (!post) {
    throw new BadRequestError(`Post with id ${postId} does not exist`);
  }
  const comments = await Comment.find({ post_id: postId });
  if (!comments) {
    throw new BadRequestError(`Comments with postId ${postId} does not exist`);
  }

  res.status(StatusCodes.OK).json({
    msg: "Posts Comments information fetched",
    nHits: comments.length,
    comments,
  });
};

const getComment = async (req, res) => {
  const { commentId, postId } = req.params;
  const post = await Post.findOne({ _id: postId });
  if (!post) {
    throw new BadRequestError(`Post with id ${postId} does not exist`);
  }
  const comment = await Comment.findOne({ _id: commentId });
  if (!comment) {
    throw new BadRequestError(`Comment with id ${commentId} does not exist`);
  }
  res
    .status(StatusCodes.OK)
    .json({ msg: "Comment information fetched", comment });
};

module.exports = {
  getComment,
  getComments,
  createComment,
  updateComment,
  deleteComment,
  getComments,
};
