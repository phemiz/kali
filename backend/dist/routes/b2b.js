"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const zod_1 = require("zod");
const verify_1 = require("../utils/verify");
const apiKeyMiddleware_1 = require("../middleware/apiKeyMiddleware");
const router = (0, express_1.Router)();
const verifySchema = zod_1.z.object({ plate_number: zod_1.z.string().min(5) });
router.post('/verify/plate', apiKeyMiddleware_1.requireApiKey, (req, res) => {
    const parsed = verifySchema.safeParse(req.body);
    if (!parsed.success)
        return res.status(400).json({ error: parsed.error.flatten() });
    const { plate_number } = parsed.data;
    const result = (0, verify_1.simulatePlateLookup)(plate_number);
    res.json(result);
});
exports.default = router;
