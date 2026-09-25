import {
  sequelize,
  Product,
  ProductVersion,
} from "../models/index.js";

const products = [
  {
    id: 1,
    name: "SIM",
    label: "SIM",
    tagline: "Strategic Institute Management",
    description:
      "A comprehensive educational ERP by Global Infoventures Pvt. Ltd. (GIIndia).",
    logo: "sim",
    isActive: true,
    isDeleted: false,
  },

  {
    id: 2,
    name: "iSIM",
    label: "iSIM",
    tagline: "Integrated Student Information Management",
    description:
      "An integrated student information and campus management platform by GIIndia.",
    logo: "isim",
    isActive: true,
    isDeleted: false,
  },

  {
    id: 3,
    name: "myConnect",
    label: "myConnect",
    tagline: "Mobile Campus Management",
    description:
      "A mobile-first campus management application by GIIndia.",
    logo: "myconnect",
    isActive: true,
    isDeleted: false,
  },
];

const productVersions = [
  // SIM
  {
    productId: 1,
    version: 5,
    isActive: true,
    isDeleted: false,
  },
  {
    productId: 1,
    version: 6,
    isActive: true,
    isDeleted: false,
  },
  {
    productId: 1,
    version: 7,
    isActive: true,
    isDeleted: false,
  },

  // iSIM
  {
    productId: 2,
    version: 5,
    isActive: true,
    isDeleted: false,
  },
  {
    productId: 2,
    version: 6,
    isActive: true,
    isDeleted: false,
  },
  {
    productId: 2,
    version: 7,
    isActive: true,
    isDeleted: false,
  },

  // myConnect
  {
    productId: 3,
    version: 5,
    isActive: true,
    isDeleted: false,
  },
  {
    productId: 3,
    version: 6,
    isActive: true,
    isDeleted: false,
  },
  {
    productId: 3,
    version: 7,
    isActive: true,
    isDeleted: false,
  },
];

try {
  await sequelize.authenticate();

  console.log("✅ Database connected");

  // Insert products
  for (const product of products) {
    await Product.upsert(product);
  }

  console.log("✅ 3 products inserted/updated");

  // Insert versions
  for (const productVersion of productVersions) {
    await ProductVersion.findOrCreate({
      where: {
        productId: productVersion.productId,
        version: productVersion.version,
      },
      defaults: productVersion,
    });
  }

  console.log("✅ Product versions inserted successfully");
} catch (error) {
  console.error("❌ Seeder failed:");
  console.error(error);
} finally {
  await sequelize.close();
}