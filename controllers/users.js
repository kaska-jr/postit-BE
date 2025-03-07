const User = require("../models/User");
const Post = require("../models/Post");
const { StatusCodes } = require("http-status-codes");
const { BadRequestError } = require("../errors");
const Comment = require("../models/Comment");

const registerUser = async (req, res) => {
  const isUser = await User.findOne({
    username: req.body.username,
  });
  if (isUser) {
    throw new BadRequestError(
      `User with username ${req.body.username} already exists`
    );
  }
  const user = await User.create(req.body);
  res
    .status(StatusCodes.CREATED)
    .json({ msg: "user registered successfully", user: user });
};

const loginUser = async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    throw new BadRequestError("Please both provide email and password");
  }
  const user = await User.findOne({ email });
  if (!user) {
    throw new BadRequestError("user Does not exist in out database");
  }
  const isPasswordCorrect = await user.comparePassword(password);
  if (!isPasswordCorrect) {
    throw new BadRequestError("Invalid Credentials");
  }
  const token = user.createJWT();
  res.status(StatusCodes.OK).json({ token, msg: "login successful" });
};

const updateUser = async (req, res) => {
  // nested destructuring
  const {
    user: { userId: userId },
    params: { userId: userIdFromParams },
    body: { username, bio, fullName, phoneNumber, country },
  } = req;

  // Makes user that the user with making the request is the authenticated user
  const isNotAuthorized = userIdFromParams !== userId;
  if (isNotAuthorized) {
    throw new BadRequestError("You are not authorized to update this user");
  }

  const Map_payload = {
    username,
    bio,
    fullName,
    phoneNumber,
    country,
  };

  const payload = Object.fromEntries(
    Object.entries(Map_payload).filter(([key, value]) => Boolean(value))
  );
  if (!Object.keys(payload).length) {
    throw new BadRequestError("Please provide at least one value to update");
  }
  const user = await User.findOneAndUpdate({ _id: userId }, payload, {
    new: true,
    runValidators: true,
  });
  if (!user) {
    throw new BadRequestError(`User with id ${userId} does not exist`);
  }

  res.status(StatusCodes.OK).json({ msg: "User updated Successfully", user });
};

const deleteUser = async (req, res) => {
  const { userId } = req.params;
  await User.findOneAndDelete({ _id: userId });
  res.status(StatusCodes.OK).json({ msg: "User deleted successfully" });
};

const getUser = async (req, res) => {
  const { userId } = req.params;
  const user = await User.findOne({ _id: userId });
  if (!user) {
    throw new BadRequestError(`User with id ${userId} does not exist`);
  }
  res.status(StatusCodes.OK).json({ msg: "User information fetched", user });
};

const getAllUsers = async (req, res) => {
  const users = await User.find({}); //gets all users in the database
  res
    .status(StatusCodes.CREATED)
    .json({ msg: "all users", nHits: users.length, users });
};

// Extra Post resources
const getUserPosts = async (req, res) => {
  const { userId } = req.params;
  const posts = await Post.find({ user_id: userId });
  res
    .status(StatusCodes.OK)
    .json({ msg: "User posts", nHits: posts.length, posts });
};

const getUserPost = async (req, res) => {
  const { postId, userId } = req.params;
  const post = await Post.findOne({ _id: postId, user_id: userId });
  if (!post) {
    throw new BadRequestError(`Post with id ${postId} does not exist`);
  }
  res.status(StatusCodes.OK).json({ msg: "Post information fetched", post });
};

const getUserPostComments = async (req, res) => {
  const { postId } = req.params;
  const comments = await Comment.find({ post_id: postId });
  if (!comments) {
    throw new BadRequestError(`no comments found for post with id ${postId}`);
  }
  res
    .status(StatusCodes.OK)
    .json({ msg: "Post comments fetched", nHits: comments.length, comments });
};

const getUserPostComment = async (req, res) => {
  const { commentId, postId } = req.params;
  const comment = await Comment.findOne({ _id: commentId, post_id: postId });
  if (!comment) {
    throw new BadRequestError(`Comment with id ${commentId} does not exist`);
  }
  res.status(StatusCodes.OK).json({ msg: "Comment fetched", comment });
};

const getUserByHandle = async (req, res) => {
  const { username } = req.params;
  const user = await User.findOne({ username });
  if (!user) {
    throw new BadRequestError(`User with username ${username} does not exist`);
  }
  res.status(StatusCodes.OK).json({ msg: "User fetched", user });
};

const getUserPostsByHandle = async (req, res) => {
  const { username } = req.params;
  const user = await User.findOne({ username });
  if (!user) {
    throw new BadRequestError(`User with username ${username} does not exist`);
  }
  const { userId } = user;

  const posts = await Post.find({ user_id: userId });
  if (!posts) {
    throw new BadRequestError(
      `no posts found for user with username ${username}`
    );
  }

  res
    .status(StatusCodes.OK)
    .json({ msg: "User posts", nHits: posts.length, posts });
};

module.exports = {
  registerUser,
  loginUser,
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
};
