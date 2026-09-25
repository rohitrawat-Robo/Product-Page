import express from "express";

import {
  getProducts,
  selectProducts,
} from "../controllers/productController.js";

const router = express.Router();

router.get("/", getProducts);

router.post("/select", selectProducts);

export default router;