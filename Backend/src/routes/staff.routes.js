import express from "express";
import * as staffController from "../controller/staff.controller.js";
import { authenticateStaff, authorize } from "../middleware/staffAuth.js";

const router = express.Router();

/** Public login */
router.post("/login", staffController.staffLogin);

/** Staff Profile (Self) */
router.get("/me", authenticateStaff, staffController.getStaffProfile);

/** Admin Only: Manage Staff */
router.post("/managers", authenticateStaff, authorize('ADMIN'), staffController.addManager);
router.get("/managers", authenticateStaff, authorize('ADMIN'), staffController.listManagers);
router.delete("/managers/:id", authenticateStaff, authorize('ADMIN'), staffController.deleteManager);

/** Management: FAQs */
router.get("/faqs", authenticateStaff, staffController.listFaqs); // Accessible for view by anyone, manage protected
router.post("/faqs", authenticateStaff, authorize('canManageFAQs'), staffController.createFaq);
router.post("/faqs/bulk", authenticateStaff, authorize('canManageFAQs'), staffController.bulkCreateFaqs);
router.put("/faqs/:id", authenticateStaff, authorize('canManageFAQs'), staffController.updateFaq);
router.delete("/faqs/:id", authenticateStaff, authorize('canManageFAQs'), staffController.deleteFaq);

/** Management: Banners */
router.get("/banners", authenticateStaff, staffController.listBanners);
router.post("/banners", authenticateStaff, authorize('canManageBanners'), staffController.createBanner);
router.delete("/banners/:id", authenticateStaff, authorize('canManageBanners'), staffController.deleteBanner);

// NOTE: Add other role protections for manage users, cards, etc.
// For example:
// router.get("/users", authenticateStaff, authorize('canManageUsers'), staffController.listAllUsers);

export default router;
