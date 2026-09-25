import { DataTypes } from "sequelize";

export default (sequelize) => {
  const ProductVersion = sequelize.define(
    "ProductVersion",
    {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },

      productId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        field: "product_id",
      },

      version: {
        type: DataTypes.INTEGER,
        allowNull: false,
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
    },
    {
      tableName: "product_versions",
      timestamps: true,
    }
  );

  return ProductVersion;
};