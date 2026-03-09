// src/middleware/idempotency.middleware.js
import crypto from 'crypto';
import { prisma } from "../config/prismaClient.js";

const hashRequest = (body) =>
    crypto.createHash('sha256').update(JSON.stringify(body)).digest('hex');

export const idempotencyMiddleware = async (req, res, next) => {
    const key = req.headers['idempotency-key'];
    const userId = req.user.id;

    if (!key) {
        return res.status(400).json({
            success: false,
            error: 'Idempotency-Key header is required'
        });
    }

    const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
    if (!uuidRegex.test(key)) {
        return res.status(400).json({
            success: false,
            error: 'Idempotency-Key must be a valid UUID v4'
        });
    }

    const requestHash = hashRequest(req.body);

    try {
        const existing = await prisma.idempotencyKey.findUnique({
            where: { userId_key: { userId, key } }
        });

        if (existing) {
            // Expired → delete and allow fresh processing
            if (existing.expiresAt < new Date()) {
                await prisma.idempotencyKey.delete({ where: { id: existing.id } });
                // fall through ↓
            }

            // Same key + different body = security reject
            else if (existing.requestHash !== requestHash) {
                return res.status(422).json({
                    success: false,
                    error: 'This idempotency key was already used with different request data'
                });
            }

            // Still processing (server crash ho gaya tha shayad)
            else if (existing.status === 'processing') {
                return res.status(409).json({
                    success: false,
                    error: 'This request is already being processed. Retry in a moment.'
                });
            }

            // Failed last time → allow retry, delete old record
            else if (existing.status === 'failed') {
                await prisma.idempotencyKey.delete({ where: { id: existing.id } });
                // fall through ↓
            }

            // ✅ Already completed → return cached response (NO double debit!)
            else if (existing.status === 'completed') {
                return res.status(existing.statusCode).json(existing.responseBody);
            }
        }

        // Insert new record — "processing" status
        // @@unique constraint = race condition mein sirf ek hi insert hoga
        const record = await prisma.idempotencyKey.create({
            data: { key, userId, requestHash, status: 'processing' }
        });

        // Response intercept — result DB mein save karo
        const originalJson = res.json.bind(res);
        res.json = async (body) => {
            const status = res.statusCode >= 200 && res.statusCode < 300
                ? 'completed'
                : 'failed';

            await prisma.idempotencyKey.update({
                where: { id: record.id },
                data: { responseBody: body, statusCode: res.statusCode, status }
            });

            return originalJson(body);
        };

        next();

    } catch (err) {
        // P2002 = @@unique violation = race condition (double click same time)
        if (err.code === 'P2002') {
            return res.status(409).json({
                success: false,
                error: 'Duplicate request detected. Please wait and retry.'
            });
        }
        next(err);
    }
};