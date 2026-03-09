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
