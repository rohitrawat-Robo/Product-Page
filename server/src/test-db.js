import sequelize from "./config/database.js";

try {
  await sequelize.authenticate();

  console.log("✅ MySQL connection successful!");
  console.log(`📦 Database: ${process.env.DB_NAME}`);
} catch (error) {
  console.error("❌ MySQL connection failed:");
  console.error(error.message);
} finally {
  await sequelize.close();
}