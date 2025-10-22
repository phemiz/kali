"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const crypto_1 = __importDefault(require("crypto"));
const db_1 = require("../utils/db");
async function main() {
    const name = process.argv[2] || 'Default Key';
    const apiKey = crypto_1.default.randomBytes(24).toString('hex');
    const rate = Number(process.env.B2B_DEFAULT_RATE_LIMIT_PER_MINUTE || 60);
    const rows = await (0, db_1.runQuery)('INSERT INTO api_keys (name, api_key, rate_limit_per_minute) VALUES ($1,$2,$3) RETURNING id, api_key', [name, apiKey, rate]);
    console.log('Created API key:', rows[0].api_key);
}
main().catch((e) => {
    console.error(e);
    process.exit(1);
});
