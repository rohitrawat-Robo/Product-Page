import { DataTypes } from "sequelize";

export default (sequelize) => {
  const User = sequelize.define(
    "User",
    {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },

      organizationId: {
        type: DataTypes.INTEGER,
        allowNull: true,
        field: "organization_id",
      },

      firstName: {
        type: DataTypes.STRING(100),
        allowNull: false,
        field: "first_name",
      },

      lastName: {
        type: DataTypes.STRING(100),
        allowNull: true,
        field: "last_name",
      },

      email: {
        type: DataTypes.STRING(255),
        allowNull: false,
        unique: true,
      },

      phone: {
        type: DataTypes.STRING(30),
        allowNull: true,
      },

      passwordHash: {
        type: DataTypes.STRING(255),
        allowNull: true,
        field: "password_hash",
      },

      role: {
        type: DataTypes.ENUM("admin", "user"),
        allowNull: false,
        defaultValue: "user",
      },

      status: {
        type: DataTypes.ENUM("pending", "active", "disabled"),
        allowNull: false,
        defaultValue: "pending",
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
      tableName: "users",
      timestamps: true,
    }
  );

  return User;
};