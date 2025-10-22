"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.requireAuth = requireAuth;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
function requireAuth(req, res, next) {
    const header = req.headers.authorization || '';
    const token = header.startsWith('Bearer ') ? header.slice(7) : undefined;
    if (!token) {
        return res.status(401).json({ error: 'Missing Bearer token' });
    }
    const secret = process.env.JWT_SECRET;
    if (!secret) {
        return res.status(500).json({ error: 'Server misconfigured: JWT_SECRET missing' });
    }
    try {
        const payload = jsonwebtoken_1.default.verify(token, secret);
        req.user = { id: payload.sub, email: payload.email, full_name: payload.full_name };
        next();
    }
    catch (err) {
        return res.status(401).json({ error: 'Invalid or expired token' });
    }
}
