import httpStatus from "http-status";
import * as staffService from "../services/staff.service.js";
import * as managementService from "../services/management.service.js";

/** Staff Authentication */
export async function staffLogin(req, res, next) {
    try {
        const { email, password } = req.body;
        const result = await staffService.loginStaff(email, password);
        res.status(httpStatus.OK).json({ success: true, message: "Login successful", data: result });
    } catch (err) {
        next(err);
    }
}

export async function changePassword(req, res, next) {
    try {
        const result = await staffService.changeStaffPassword(req.staff.id, req.body);
        res.status(httpStatus.OK).json({ success: true, ...result });
    } catch (err) {
        next(err);
    }
}


/** Admin: Add Manager */
export async function addManager(req, res, next) {
    try {
        const manager = await staffService.createManager(req.staff.id, req.body);
        res.status(httpStatus.CREATED).json({ success: true, message: "Manager added successfully", data: manager });
    } catch (err) {
        next(err);
    }
}

/** Admin: List Managers */
export async function listManagers(req, res, next) {
    try {
        const managers = await staffService.getAllManagers();
        res.status(httpStatus.OK).json({ success: true, data: managers });
    } catch (err) {
        next(err);
    }
}

/** Admin: Delete Manager */
export async function deleteManager(req, res, next) {
    try {
        await staffService.deleteStaff(req.params.id);
        res.status(httpStatus.OK).json({ success: true, message: "Manager deleted" });
    } catch (err) {
        next(err);
    }
}

/** FAQ Management */
export async function listFaqs(req, res, next) {
    try {
        const faqs = await managementService.getAllFaqs();
        res.status(httpStatus.OK).json({ success: true, data: faqs });
    } catch (err) {
        next(err);
    }
}

export async function createFaq(req, res, next) {
    try {
        const faq = await managementService.createFaq(req.body);
        res.status(httpStatus.CREATED).json({ success: true, message: "FAQ created", data: faq });
    } catch (err) {
        next(err);
    }
}

export async function bulkCreateFaqs(req, res, next) {
    try {
        const result = await managementService.createMultipleFaqs(req.body.faqs);
        res.status(httpStatus.CREATED).json({ success: true, message: "FAQs created", data: result });
    } catch (err) {
        next(err);
    }
}

export async function updateFaq(req, res, next) {
    try {
        const faq = await managementService.updateFaq(req.params.id, req.body);
        res.status(httpStatus.OK).json({ success: true, message: "FAQ updated", data: faq });
    } catch (err) {
        next(err);
    }
}

export async function deleteFaq(req, res, next) {
    try {
        await managementService.deleteFaq(req.params.id);
        res.status(httpStatus.OK).json({ success: true, message: "FAQ deleted" });
    } catch (err) {
        next(err);
    }
}

/** Banner Management */
export async function listBanners(req, res, next) {
    try {
        const banners = await managementService.getAllBanners();
        res.status(httpStatus.OK).json({ success: true, data: banners });
    } catch (err) {
        next(err);
    }
}

export async function createBanner(req, res, next) {
    try {
        const banner = await managementService.createBanner(req.body);
        res.status(httpStatus.CREATED).json({ success: true, message: "Banner created", data: banner });
    } catch (err) {
        next(err);
    }
}

export async function deleteBanner(req, res, next) {
    try {
        await managementService.deleteBanner(req.params.id);
        res.status(httpStatus.OK).json({ success: true, message: "Banner deleted" });
    } catch (err) {
        next(err);
    }
}

/** Category Management */
export async function listCategories(req, res, next) {
    try {
        const categories = await managementService.getAllCategories();
        res.status(httpStatus.OK).json({ success: true, data: categories });
    } catch (err) {
        next(err);
    }
}

export async function createCategory(req, res, next) {
    try {
        const category = await managementService.createCategory(req.body);
        res.status(httpStatus.CREATED).json({ success: true, message: "Category created", data: category });
    } catch (err) {
        next(err);
    }
}

export async function updateCategory(req, res, next) {
    try {
        const category = await managementService.updateCategory(req.params.id, req.body);
        res.status(httpStatus.OK).json({ success: true, message: "Category updated", data: category });
    } catch (err) {
        next(err);
    }
}

export async function deleteCategory(req, res, next) {
    try {
        await managementService.deleteCategory(req.params.id);
        res.status(httpStatus.OK).json({ success: true, message: "Category deleted" });
    } catch (err) {
        next(err);
    }
}

/** Product Management */
export async function listProducts(req, res, next) {
    try {
        const products = await managementService.getAllProducts();
        res.status(httpStatus.OK).json({ success: true, data: products });
    } catch (err) {
        next(err);
    }
}

export async function listProductsByCategory(req, res, next) {
    try {
        const products = await managementService.getProductsByCategory(req.params.categoryId);
        res.status(httpStatus.OK).json({ success: true, data: products });
    } catch (err) {
        next(err);
    }
}

export async function createProduct(req, res, next) {
    try {
        const product = await managementService.createProduct(req.body);
        res.status(httpStatus.CREATED).json({ success: true, message: "Product created", data: product });
    } catch (err) {
        next(err);
    }
}

export async function updateProduct(req, res, next) {
    try {
        const product = await managementService.updateProduct(req.params.id, req.body);
        res.status(httpStatus.OK).json({ success: true, message: "Product updated", data: product });
    } catch (err) {
        next(err);
    }
}

export async function deleteProduct(req, res, next) {
    try {
        await managementService.deleteProduct(req.params.id);
        res.status(httpStatus.OK).json({ success: true, message: "Product deleted" });
    } catch (err) {
        next(err);
    }
}


/** Staff Profile Meta (Self-check for permissions) */
export async function getStaffProfile(req, res, next) {
    try {
        res.status(httpStatus.OK).json({ success: true, data: req.staff });
    } catch (err) {
        next(err);
    }
}
