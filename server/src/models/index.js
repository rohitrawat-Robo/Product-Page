import sequelize from "../config/database.js";

import OrganizationModel from "./Organization.js";
import UserModel from "./User.js";
import ProductModel from "./Product.js";
import ProductVersionModel from "./ProductVersion.js";
import UserProductModel from "./UserProduct.js";


// ==========================================
// INITIALIZE MODELS
// ==========================================

const Organization = OrganizationModel(sequelize);
const User = UserModel(sequelize);
const Product = ProductModel(sequelize);
const ProductVersion = ProductVersionModel(sequelize);
const UserProduct = UserProductModel(sequelize);


// ==========================================
// ORGANIZATION → USERS
// ==========================================

Organization.hasMany(User, {
  foreignKey: "organizationId",
  as: "users",
});

User.belongsTo(Organization, {
  foreignKey: "organizationId",
  as: "organization",
});


// ==========================================
// PRODUCT → PRODUCT VERSIONS
// ==========================================

Product.hasMany(ProductVersion, {
  foreignKey: "productId",
  as: "versions",
});

ProductVersion.belongsTo(Product, {
  foreignKey: "productId",
  as: "product",
});


// ==========================================
// USER → USER PRODUCTS
// ==========================================

User.hasMany(UserProduct, {
  foreignKey: "userId",
  as: "selectedProducts",
});

UserProduct.belongsTo(User, {
  foreignKey: "userId",
  as: "user",
});


// ==========================================
// PRODUCT → USER PRODUCTS
// ==========================================

Product.hasMany(UserProduct, {
  foreignKey: "productId",
  as: "userSelections",
});

UserProduct.belongsTo(Product, {
  foreignKey: "productId",
  as: "product",
});


// ==========================================
// PRODUCT VERSION → USER PRODUCTS
// ==========================================

ProductVersion.hasMany(UserProduct, {
  foreignKey: "versionId",
  as: "userSelections",
});

UserProduct.belongsTo(ProductVersion, {
  foreignKey: "versionId",
  as: "version",
});


// ==========================================
// EXPORT MODELS
// ==========================================

export {
  sequelize,
  Organization,
  User,
  Product,
  ProductVersion,
  UserProduct,
};