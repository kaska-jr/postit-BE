const { StatusCodes } = require("http-status-codes");
const Post = require("../models/Post");
const Comment = require("../models/Comment");

const createPost = async (req, res) => {
  const { userId } = req.user;
  const { post_content } = req.body;
  const post = await Post.create({ user_id: userId, post_content });
  res
    .status(StatusCodes.CREATED)
    .json({ msg: "post created successfully", post });
};

const updatePost = async (req, res) => {
  const { postId } = req.params;
  const { post_content } = req.body;
  const post = await Post.findOneAndUpdate(
    { _id: postId },
    { post_content },
    { new: true }
  );

  if (!post) {
    throw new BadRequestError(`Post with id ${postId} does not exist`);
  }

  res.status(StatusCodes.OK).json({ msg: "Post updated successfully", post });
};

const deletePost = async (req, res) => {
  const { postId } = req.params;
  const post = await Post.findOneAndDelete({ _id: postId });
  if (!post) {
    throw new BadRequestError(`Post with id ${postId} does not exist`);
  }
  res.status(StatusCodes.OK).json({ msg: "Post deleted successfully" });
};

const getAllPosts = async (req, res) => {
  const posts = await Post.find({});
  res
    .status(StatusCodes.OK)
    .json({ msg: "All post on the database", nHits: posts.length, posts });
};

const getPost = async (req, res) => {
  const { postId } = req.params;
  const post = await Post.findOne({ _id: postId });
  if (!post) {
    throw new BadRequestError(`Post with id ${postId} does not exist`);
  }
  res.status(StatusCodes.OK).json({ msg: "Post information fetched", post });
};

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

module.exports = {
  getPost,
  getAllPosts,
  createPost,
  updatePost,
  deletePost,
  createComment,
};
