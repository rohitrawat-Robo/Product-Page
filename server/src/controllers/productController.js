import {
  User,
  Product,
  ProductVersion,
  UserProduct,
  Organization,
} from "../models/index.js";
import "dotenv/config";

/*
|--------------------------------------------------------------------------
| GET /api/products
|--------------------------------------------------------------------------
| Get all active products and their active versions
*/
export const getProducts = async (req, res) => {
  try {
    const products = await Product.findAll({
      where: {
        isActive: true,
        isDeleted: false,
      },

      include: [
        {
          model: ProductVersion,
          as: "versions",
          where: {
            isActive: true,
            isDeleted: false,
          },
          required: false,
          attributes: [
            "id",
            "productId",
            "version",
            "isActive",
            "isDeleted",
          ],
        },
      ],

      order: [
        ["id", "ASC"],
        [{ model: ProductVersion, as: "versions" }, "version", "ASC"],
      ],
    });

    return res.status(200).json({
      success: true,
      count: products.length,
      data: products,
    });
  } catch (error) {
    console.error("GET PRODUCTS ERROR:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to fetch products.",
      error: error.message,
    });
  }
};


/*
|--------------------------------------------------------------------------
| POST /api/products/select
|--------------------------------------------------------------------------
| Save selected products for a user
|--------------------------------------------------------------------------
|
| Expected body:
|
| {
|   "userId": 1,
|   "selections": [
|     {
|       "productId": 1,
|       "versionId": 2
|     },
|     {
|       "productId": 3,
|       "versionId": 8
|     }
|   ]
| }
|
*/
export const selectProducts = async (req, res) => {
  try {
    const { userId, selections } = req.body;

    // --------------------------------------------------
    // Validate userId
    // --------------------------------------------------

    if (!userId) {
      return res.status(400).json({
        success: false,
        message: "User ID is required.",
      });
    }

    // --------------------------------------------------
    // Validate selections
    // --------------------------------------------------

    if (!Array.isArray(selections) || selections.length === 0) {
      return res.status(400).json({
        success: false,
        message: "At least one product must be selected.",
      });
    }

    // --------------------------------------------------
    // Check user
    // --------------------------------------------------

    const user = await User.findOne({
      where: {
        id: userId,
        isActive: true,
        isDeleted: false,
      },
      include: [
        {
          model: Organization,
          as: "organization",
          attributes: ["id", "name", "slug"],
        },
      ],
    });

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found.",
      });
    }

    const savedProducts = [];

    // --------------------------------------------------
    // Process each selected product
    // --------------------------------------------------

    for (const selection of selections) {
      const { productId, versionId } = selection;

      if (!productId || !versionId) {
        return res.status(400).json({
          success: false,
          message: "productId and versionId are required.",
        });
      }

      // ------------------------------------------------
      // Check product
      // ------------------------------------------------

      const product = await Product.findOne({
        where: {
          id: productId,
          isActive: true,
          isDeleted: false,
        },
      });

      if (!product) {
        return res.status(404).json({
          success: false,
          message: `Product ${productId} not found.`,
        });
      }

      // ------------------------------------------------
      // Check product version
      // ------------------------------------------------

      const productVersion = await ProductVersion.findOne({
        where: {
          id: versionId,
          productId: productId,
          isActive: true,
          isDeleted: false,
        },
      });

      if (!productVersion) {
        return res.status(404).json({
          success: false,
          message: `Invalid version ${versionId} for product ${productId}.`,
        });
      }

      // ------------------------------------------------
      // Check duplicate selection
      // ------------------------------------------------

      const existingSelection = await UserProduct.findOne({
        where: {
          userId,
          productId,
          versionId,
        },
      });

      if (existingSelection) {
        savedProducts.push(existingSelection);

        continue;
      }

      // ------------------------------------------------
      // Create selection
      // ------------------------------------------------

      const userProduct = await UserProduct.create({
        userId,
        productId,
        versionId,
        isActive: true,
        isDeleted: false,
        selectedAt: new Date(),
      });

      savedProducts.push(userProduct);
    }
console.log(user.organization);
console.log(process.env.DIR_SETUP_URL);
    if (user.organization && process.env.DIR_SETUP_URL) {
      try {
        const setupUrl = process.env.DIR_SETUP_URL
          .replace("{site}", encodeURIComponent(user.organization.slug))
          .replace("{pwd}", encodeURIComponent(process.env.DIR_SETUP_KEY || ""));

        const setupResponse = await fetch(setupUrl, { method: "GET" });

        if (!setupResponse.ok) {
          console.error(
            `DIR SETUP CALL FAILED: ${setupResponse.status} ${setupResponse.statusText}`
          );
        }
      } catch (setupError) {
        // Don't fail the whole request just because the setup ping failed
        console.error("DIR SETUP CALL ERROR:", setupError);
      }
    }

    return res.status(201).json({
      success: true,
      message: "Products selected successfully.",
      data: savedProducts,
    });
  } catch (error) {
    console.error("SELECT PRODUCTS ERROR:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to save product selection.",
      error: error.message,
    });
  }
};