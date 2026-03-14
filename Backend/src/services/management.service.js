import { prisma } from "../config/prismaClient.js";
import ApiError from "../utils/ApiError.js";
import httpStatus from "http-status";

/** List all FAQs */
export async function getAllFaqs() {
    return await prisma.faq.findMany({
        orderBy: { createdAt: "desc" }
    });
}

/** Create a new FAQ */
export async function createFaq(data) {
    return await prisma.faq.create({
        data: {
            question: data.question,
            answer: data.answer
        }
    });
}

/** Bulk create FAQs */
export async function createMultipleFaqs(faqs) {
    if (!Array.isArray(faqs) || faqs.length === 0) {
        throw new ApiError(httpStatus.BAD_REQUEST, "Invalid FAQ list");
    }
    return await prisma.faq.createMany({
        data: faqs.map(f => ({
            question: f.question,
            answer: f.answer
        }))
    });
}

/** Update an FAQ */
export async function updateFaq(id, data) {
    const existing = await prisma.faq.findUnique({ where: { id } });
    if (!existing) throw new ApiError(httpStatus.NOT_FOUND, "FAQ not found");

    return await prisma.faq.update({
        where: { id },
        data: {
            question: data.question || existing.question,
            answer: data.answer || existing.answer
        }
    });
}

/** Delete an FAQ */
export async function deleteFaq(id) {
    return await prisma.faq.delete({ where: { id } });
}

/** List all Banners */
export async function getAllBanners() {
    return await prisma.banner.findMany({
        orderBy: { createdAt: "desc" }
    });
}

/** Create a Banner */
export async function createBanner(data) {
    return await prisma.banner.create({
        data: {
            type: data.type,
            title: data.title,
            description: data.description,
            imageUrl: data.imageUrl
        }
    });
}

/** Delete a Banner */
export async function deleteBanner(id) {
    return await prisma.banner.delete({ where: { id } });
}

/** --- Category Management --- */

export async function getAllCategories() {
    return await prisma.category.findMany({
        include: { products: true },
        orderBy: { createdAt: "desc" }
    });
}

export async function createCategory(data) {
    const existing = await prisma.category.findUnique({ where: { name: data.name } });
    if (existing) throw new ApiError(httpStatus.BAD_REQUEST, "Category with this name already exists");

    return await prisma.category.create({
        data: {
            name: data.name,
            imageUrl: data.imageUrl
        }
    });
}

export async function updateCategory(id, data) {
    const existing = await prisma.category.findUnique({ where: { id } });
    if (!existing) throw new ApiError(httpStatus.NOT_FOUND, "Category not found");

    return await prisma.category.update({
        where: { id },
        data: {
            name: data.name || existing.name,
            imageUrl: data.imageUrl || existing.imageUrl
        }
    });
}

export async function deleteCategory(id) {
    return await prisma.category.delete({ where: { id } });
}

/** --- Product Management --- */

export async function getAllProducts() {
    return await prisma.product.findMany({
        include: { category: true },
        orderBy: { createdAt: "desc" }
    });
}

export async function getProductsByCategory(categoryId) {
    return await prisma.product.findMany({
        where: { categoryId },
        orderBy: { createdAt: "desc" }
    });
}

export async function createProduct(data) {
    const category = await prisma.category.findUnique({ where: { id: data.categoryId } });
    if (!category) throw new ApiError(httpStatus.NOT_FOUND, "Category not found");

    return await prisma.product.create({
        data: {
            name: data.name,
            description: data.description,
            imageUrl: data.imageUrl,
            price: data.price,
            categoryId: data.categoryId
        }
    });
}

export async function updateProduct(id, data) {
    const existing = await prisma.product.findUnique({ where: { id } });
    if (!existing) throw new ApiError(httpStatus.NOT_FOUND, "Product not found");

    return await prisma.product.update({
        where: { id },
        data: {
            name: data.name || existing.name,
            description: data.description || existing.description,
            imageUrl: data.imageUrl || existing.imageUrl,
            price: data.price || existing.price,
            categoryId: data.categoryId || existing.categoryId
        }
    });
}

export async function deleteProduct(id) {
    return await prisma.product.delete({ where: { id } });
}

