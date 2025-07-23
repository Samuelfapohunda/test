"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.loginUser = exports.registerUser = void 0;
const bcrypt_1 = __importDefault(require("bcrypt"));
const knexInstance_1 = __importDefault(require("../db/knexInstance")); // adjust if your knex instance is elsewhere
const registerUser = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { name, email, password } = req.body;
    try {
        const existingUser = yield (0, knexInstance_1.default)("users").where({ email }).first();
        if (existingUser) {
            return res.status(409).json({ error: "User already exists" });
        }
        const hashedPassword = yield bcrypt_1.default.hash(password, 10);
        const [user] = yield (0, knexInstance_1.default)("users")
            .insert({
            name,
            email,
            password: hashedPassword,
        })
            .returning(["id", "name", "email"]);
        res.status(201).json({ message: "User registered successfully", user });
    }
    catch (error) {
        console.error("Registration Error:", error);
        res.status(500).json({ error: "Internal server error" });
    }
});
exports.registerUser = registerUser;
// ✅ Add this for login
const loginUser = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { email, password } = req.body;
    try {
        const user = yield (0, knexInstance_1.default)("users").where({ email }).first();
        if (!user) {
            return res.status(401).json({ error: "Invalid email or password" });
        }
        const isPasswordValid = yield bcrypt_1.default.compare(password, user.password);
        if (!isPasswordValid) {
            return res.status(401).json({ error: "Invalid email or password" });
        }
        // For now we’re not using JWT — just respond
        res.status(200).json({ message: "Login successful", user: {
                id: user.id,
                name: user.name,
                email: user.email
            } });
    }
    catch (error) {
        console.error("Login Error:", error);
        res.status(500).json({ error: "Internal server error" });
    }
});
exports.loginUser = loginUser;
