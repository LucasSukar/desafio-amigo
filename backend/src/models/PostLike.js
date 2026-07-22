import Sequelize, { Model } from "sequelize";

class PostLike extends Model {
  static init(sequelize) {
    super.init(
      {
        liked_at: Sequelize.DATE,
        is_deleted: Sequelize.BOOLEAN,
      },
      {
        sequelize,
      },
    );
    return this;
  }
  static associate(models){
    this.belongsTo(models.Post, { foreignKey: "post_id", as: "post" });
    this.belongsTo(models.User, { foreignKey: "user_id", as: "user" });
  }
}

export default PostLike;
