import Sequelize, { Model } from "sequelize";

class Post extends Model {
  static init(sequelize) {
    super.init(
      {
        content: Sequelize.STRING,
        title: Sequelize.STRING,
        resume: Sequelize.STRING,
        data_publicacao: Sequelize.DATE,
        image_url: Sequelize.STRING,
      },
      { sequelize }
    );
    return this;
  }

  static associate(models) {
    this.belongsTo(models.User, { foreignKey: "user_id", as: "user" });
    this.hasMany(models.PostLike, { foreignKey: "post_id", as: "likes" });
    this.hasMany(models.Comment, { foreignKey: "post_id", as: "comments" });
  }
}

export default Post;
