"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const db_1 = require("../utils/db");
const authMiddleware_1 = require("../middleware/authMiddleware");
const router = (0, express_1.Router)();
router.get('/', authMiddleware_1.requireAuth, async (req, res) => {
    const userId = req.user.id;
    const rows = await (0, db_1.runQuery)('SELECT id, full_name, email, phone, created_at FROM users WHERE id=$1', [userId]);
    if (rows.length === 0)
        return res.status(404).json({ error: 'User not found' });
    res.json(rows[0]);
});
exports.default = router;
