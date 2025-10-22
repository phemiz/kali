"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const zod_1 = require("zod");
const bcrypt_1 = __importDefault(require("bcrypt"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const db_1 = require("../utils/db");
const router = (0, express_1.Router)();
const signupSchema = zod_1.z.object({
    full_name: zod_1.z.string().min(2),
    email: zod_1.z.string().email(),
    phone: zod_1.z.string().min(7).max(20).optional().or(zod_1.z.literal('')),
    password: zod_1.z.string().min(6)
});
router.post('/signup', async (req, res) => {
    const parse = signupSchema.safeParse(req.body);
    if (!parse.success)
        return res.status(400).json({ error: parse.error.flatten() });
    const { full_name, email, phone, password } = parse.data;
    const existing = await (0, db_1.runQuery)('SELECT id FROM users WHERE email=$1', [email]);
    if (existing.length > 0)
        return res.status(409).json({ error: 'Email already registered' });
    const hash = await bcrypt_1.default.hash(password, 10);
    const inserted = await (0, db_1.runQuery)('INSERT INTO users (full_name, email, phone, password_hash) VALUES ($1,$2,$3,$4) RETURNING id, email, full_name', [full_name, email, phone || null, hash]);
    const user = inserted[0];
    const token = signJwt(user.id, user.email, user.full_name);
    res.status(201).json({ token, user });
});
const loginSchema = zod_1.z.object({ email: zod_1.z.string().email(), password: zod_1.z.string().min(6) });
router.post('/login', async (req, res) => {
    const parse = loginSchema.safeParse(req.body);
    if (!parse.success)
        return res.status(400).json({ error: parse.error.flatten() });
    const { email, password } = parse.data;
    const rows = await (0, db_1.runQuery)('SELECT id, email, full_name, password_hash FROM users WHERE email=$1', [email]);
    if (rows.length === 0)
        return res.status(401).json({ error: 'Invalid credentials' });
    const user = rows[0];
    const ok = await bcrypt_1.default.compare(password, user.password_hash);
    if (!ok)
        return res.status(401).json({ error: 'Invalid credentials' });
    const token = signJwt(user.id, user.email, user.full_name);
    res.json({ token, user: { id: user.id, email: user.email, full_name: user.full_name } });
});
function signJwt(userId, email, fullName) {
    const envSecret = process.env.JWT_SECRET;
    if (!envSecret)
        throw new Error('JWT_SECRET not set');
    const secret = envSecret;
    const expiresInEnv = process.env.JWT_EXPIRES_IN || '7d';
    const options = { expiresIn: expiresInEnv };
    return jsonwebtoken_1.default.sign({ sub: userId, email, full_name: fullName }, secret, options);
}
exports.default = router;
