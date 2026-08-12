module.exports = {
  async up(queryInterface, Sequelize) {
    // Remove o campo comments (JSON blob) da tabela posts
    await queryInterface.removeColumn("posts", "comments");

    // Adiciona image_url opcional nos posts
    await queryInterface.addColumn("posts", "image_url", {
      type: Sequelize.STRING,
      allowNull: true,
    });

    // Cria tabela de comentários dedicada
    await queryInterface.createTable("post_comments", {
      id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
      },
      post_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: { model: "posts", key: "id" },
        onUpdate: "CASCADE",
        onDelete: "CASCADE",
      },
      user_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: { model: "users", key: "id" },
        onUpdate: "CASCADE",
        onDelete: "CASCADE",
      },
      content: {
        type: Sequelize.TEXT,
        allowNull: false,
      },
      created_at: {
        type: Sequelize.DATE,
        allowNull: false,
      },
      updated_at: {
        type: Sequelize.DATE,
        allowNull: false,
      },
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable("post_comments");
    await queryInterface.removeColumn("posts", "image_url");
    await queryInterface.addColumn("posts", "comments", {
      type: Sequelize.TEXT,
      allowNull: false,
      defaultValue: "[]",
    });
  },
};
