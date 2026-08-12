import Sequelize, { Model } from "sequelize";

class Message extends Model {
  static init(sequelize) {
    super.init(
      {
        content: Sequelize.TEXT,
        read_at: Sequelize.DATE,
      },
      { sequelize }
    );
    return this;
  }

  static associate(models) {
    this.belongsTo(models.User, { foreignKey: "from_id", as: "sender" });
    this.belongsTo(models.User, { foreignKey: "to_id", as: "recipient" });
  }
}

export default Message;
