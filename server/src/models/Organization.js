import { DataTypes } from "sequelize";

export default (sequelize) => {
  const Organization = sequelize.define(
    "Organization",
    {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },

      name: {
        type: DataTypes.STRING(255),
        allowNull: false,
        unique: true,
      },

      slug: {
        type: DataTypes.STRING(150),
        allowNull: false,
        unique: true,
      },

      status: {
        type: DataTypes.ENUM(
          "trial",
          "active",
          "suspended"
        ),
        allowNull: false,
        defaultValue: "trial",
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
      tableName: "organizations",
      timestamps: true,
    }
  );

  return Organization;
};