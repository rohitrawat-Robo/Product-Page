import { DataTypes } from "sequelize";

export default (sequelize) => {
  const UserProduct = sequelize.define(
    "UserProduct",
    {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },

      userId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        field: "user_id",
      },

      productId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        field: "product_id",
      },

      versionId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        field: "version_id",
      },

      isActive: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: true,
        field: "is_active",
      },

      isDeleted: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: false,
        field: "is_deleted",
      },

      selectedAt: {
        type: DataTypes.DATE,
        allowNull: false,
        defaultValue: DataTypes.NOW,
        field: "selected_at",
      },
    },
    {
      tableName: "user_products",
      timestamps: true,

      indexes: [
        {
          unique: true,
          fields: ["user_id", "product_id", "version_id"],
        },
      ],
    }
  );

  return UserProduct;
};