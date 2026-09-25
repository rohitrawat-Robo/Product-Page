import { sequelize } from "./models/index.js";

try {
  await sequelize.authenticate();

  console.log("✅ MySQL connection successful!");

  await sequelize.sync();

  console.log("✅ All database tables created successfully!");
} catch (error) {
  console.error("❌ Database synchronization failed:");
  console.error(error);
} finally {
  await sequelize.close();
}