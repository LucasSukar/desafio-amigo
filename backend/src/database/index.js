import Sequelize from "sequelize";
import databaseConfig from "../config/database";
import User from "../models/User";
import Post from "../models/Post";
import PostLike from "../models/PostLike";
import Comment from "../models/Comment";
import Message from "../models/Message";

const models = [User, Post, PostLike, Comment, Message];

class Database {
  constructor() {
    this.init();
  }

  init() {
    this.connection = new Sequelize(databaseConfig);

    models
      .map((model) => model.init(this.connection))
      .map((model) => model.associate && model.associate(this.connection.models));
  }
}

export default new Database();
