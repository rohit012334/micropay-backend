import express from "express";
import * as staffController from "../controller/staff.controller.js";

const router = express.Router();

/** Public Data */
router.get("/faqs", staffController.listFaqs);
router.get("/banners", staffController.listBanners);
router.get("/categories", staffController.listCategories);
router.get("/products", staffController.listProducts);
router.get("/categories/:categoryId/products", staffController.listProductsByCategory);

export default router;
